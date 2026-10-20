"use strict";

// Serialized by chrome.scripting: keep this function self-contained.
function inspectReader() {
  const allowed = host => host === "bn.gov.br" || host.endsWith(".bn.gov.br") || host === "bn.br" || host.endsWith(".bn.br");
  if (!allowed(location.hostname)) return {error: "Abra o visualizador da Biblioteca Nacional e tente novamente."};
  const docs = [document];
  for (let index = 0; index < docs.length && index < 30; index++) {
    const doc = docs[index];
    const img = doc.getElementById("DocumentoImg");
    if (img && img.tagName === "IMG") {
      if (!img.complete || !img.naturalWidth) return {error: "Aguarde a imagem terminar de carregar e clique em Atualizar."};
      const url = new URL(img.currentSrc || img.src, doc.baseURI);
      if (!/^https?:$/.test(url.protocol) || !allowed(url.hostname)) return {error: "O endereço da imagem não pertence ao acervo esperado."};
      const pageId = doc.getElementById("hPagFis")?.value || "";
      const reader = new URL(doc.location.href);
      if (pageId) reader.searchParams.set("pagfis", pageId);
      return {
        url: url.href,
        readerUrl: reader.href,
        title: doc.title || document.title || "Hemeroteca",
        width: img.naturalWidth,
        height: img.naturalHeight,
        pageId
      };
    }
    for (const frame of doc.querySelectorAll("iframe, frame")) {
      try { if (frame.contentDocument && !docs.includes(frame.contentDocument)) docs.push(frame.contentDocument); } catch (_) { /* inaccessible frame */ }
    }
  }
  return {error: "Não encontrei a imagem DocumentoImg. Abra a página do jornal no DocReader; se estiver dentro de outro site, abra o visualizador em uma aba própria."};
}

function safeName(value) {
  return value.normalize("NFC").replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").replace(/\.{2,}/g, "_").replace(/^[.\s]+|[.\s]+$/g, "").slice(0, 150) || "Hemeroteca";
}

function extensionFor(url) {
  const match = new URL(url).pathname.match(/\.(jpe?g|png|webp|gif|tiff?)$/i);
  return match ? match[1].toLowerCase() : "jpg";
}

function localDate(date = new Date()) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function titleParts(title) {
  const match = title.match(/\b((?:18|19|20)\d{2})\s*(?:a|[-–—])\s*((?:18|19|20)\d{2})\b/i);
  return {vehicle: (match ? title.slice(0, match.index).replace(/[\s:–—-]+$/, "") : title).trim(), period: match ? match[1] + "-" + match[2] : ""};
}

function makeFilename(source, custom, name, vehicle, period, date = new Date()) {
  const base = custom
    ? name.replace(/\.(jpe?g|png|webp|gif|tiff?)$/i, "")
    : [vehicle.trim() || "Veiculo-nao-identificado", period.trim() || "Periodo-nao-identificado", "baixado-" + localDate(date)].join("_");
  const suffix = !custom && source.pageId ? "_img-" + safeName(source.pageId).slice(0, 20) : "";
  return safeName(base).slice(0, 120) + suffix + "." + extensionFor(source.url);
}

const ui = Object.fromEntries(["details", "filename", "download", "reference", "refresh", "status", "vehicle", "period", "standard", "custom", "standardFields", "customFields", "preview"].map(id => [id, document.getElementById(id)]));
let source = null;
let downloadId = null;

function updatePreview() {
  ui.standardFields.hidden = ui.custom.checked;
  ui.customFields.hidden = !ui.custom.checked;
  ui.preview.textContent = source ? makeFilename(source, ui.custom.checked, ui.filename.value, ui.vehicle.value, ui.period.value) : "Aguardando página…";
}

async function refresh() {
  source = null;
  ui.download.disabled = ui.reference.disabled = ui.filename.disabled = true;
  ui.status.textContent = "";
  ui.details.textContent = "Identificando a imagem…";
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab?.id) throw new Error("Selecione a aba do jornal.");
    const [result] = await chrome.scripting.executeScript({target: {tabId: tab.id}, func: inspectReader});
    if (!result?.result) throw new Error("Não foi possível ler esta página.");
    if (result.result.error) throw new Error(result.result.error);
    source = result.result;
    ui.details.textContent = source.title + " • " + source.width + " × " + source.height + " pixels" + (source.pageId ? " • imagem " + source.pageId + " do acervo" : "");
    const parts = titleParts(source.title);
    ui.vehicle.value = parts.vehicle;
    ui.period.value = parts.period;
    updatePreview();
    ui.download.disabled = ui.reference.disabled = ui.filename.disabled = false;
  } catch (error) {
    updatePreview();
    ui.details.textContent = "Página não identificada";
    ui.status.textContent = error.message || "Abra a Hemeroteca e tente novamente.";
  }
}

ui.download.addEventListener("click", async () => {
  if (!source) return;
  ui.download.disabled = true;
  ui.status.textContent = "Abrindo a janela para salvar…";
  try {
    const filename = makeFilename(source, ui.custom.checked, ui.filename.value, ui.vehicle.value, ui.period.value);
    ui.preview.textContent = filename;
    downloadId = await chrome.downloads.download({url: source.url, filename, saveAs: true, conflictAction: "uniquify"});
    ui.status.textContent = "Download iniciado. Acompanhe também pelo painel de downloads do Chrome.";
    const [item] = await chrome.downloads.search({id: downloadId});
    if (item?.state === "complete") ui.status.textContent = "Imagem salva.";
    if (item?.state === "interrupted") ui.status.textContent = "Download interrompido: " + (item.error || "tente novamente");
  } catch (error) {
    ui.status.textContent = "Não foi possível iniciar o download: " + error.message;
  } finally { ui.download.disabled = false; }
});

chrome.downloads.onChanged.addListener(delta => {
  if (delta.id !== downloadId) return;
  if (delta.state?.current === "complete") ui.status.textContent = "Imagem salva.";
  if (delta.state?.current === "interrupted") ui.status.textContent = "Download interrompido. Confira o painel de downloads do Chrome.";
});

ui.reference.addEventListener("click", async () => {
  if (!source) return;
  const text = [
    "Título do visualizador: " + source.title,
    "Imagem do acervo: " + (source.pageId || "não identificada") + " (não equivale necessariamente à página impressa)",
    "Consulta: " + source.readerUrl,
    "Imagem: " + source.url,
    "Acesso em: " + new Date().toLocaleDateString("pt-BR"),
    "Acervo da Fundação Biblioteca Nacional — Brasil.",
    "Completar: data da edição, número da edição, página impressa, título e autoria da matéria."
  ].join("\n");
  try {
    await navigator.clipboard.writeText(text);
    ui.status.textContent = "Dados copiados. Complete a identificação bibliográfica a partir do jornal.";
  } catch (_) { ui.status.textContent = "Não foi possível copiar. Mantenha a janela da extensão em foco e tente novamente."; }
});

for (const id of ["filename", "vehicle", "period"]) ui[id].addEventListener("input", updatePreview);
for (const id of ["standard", "custom"]) ui[id].addEventListener("change", updatePreview);
ui.refresh.addEventListener("click", refresh);
refresh();
