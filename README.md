# Clio — Apoio à Pesquisa Histórica

Uma extensão gratuita para Chrome que facilita o download e a organização de imagens de jornais consultados na Hemeroteca Digital da Biblioteca Nacional.

## História e Tecnologia

Sou **Pablo Carvalho, historiador e desenvolvedor**. A Clio faz parte dos meus projetos de conectar **História e Tecnologia**, criando ferramentas a partir das necessidades práticas da pesquisa histórica.

A extensão nasceu de uma dificuldade que encontrei durante minhas pesquisas na Hemeroteca: salvar as imagens dos jornais exigia etapas manuais repetitivas. Desenvolvi a Clio para simplificar essa coleta, melhorar a organização dos arquivos e acelerar o processo de pesquisa, permitindo dedicar mais tempo à leitura, à análise e à interpretação das fontes.

Disponibilizo a ferramenta gratuitamente para ajudar outros pesquisadores, estudantes e pessoas interessadas em História em suas próprias investigações.

**Desenvolvido por [Pablo Carvalho — @pablohscarvalho](https://www.instagram.com/pablohscarvalho/).**

## O que a extensão faz

- Identifica a imagem da página aberta no visualizador DocReader.
- Baixa o arquivo na resolução já carregada pelo acervo, sem captura de tela ou recompressão.
- Permite escolher entre nome personalizado e nome padrão, com prévia antes de baixar.
- No nome padrão, reúne veículo, período da coleção, data do download e identificador da imagem.
- Copia dados da consulta para auxiliar o registro da fonte.

Exemplo de nome padrão:

```text
Diario de Pernambuco_1900-1909_baixado-2026-10-20_img-2672.jpg
```

A data no nome corresponde ao **dia do download**. Confira os campos de veículo e período antes de salvar. O identificador da imagem no acervo não equivale necessariamente à página impressa do jornal.

## Instalação pelo GitHub

1. Na página do repositório, clique em **Code → Download ZIP** e extraia o arquivo. Você também pode clonar o repositório.
2. Abra `chrome://extensions` no Chrome.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação**.
5. Selecione a pasta que contém o arquivo `manifest.json`.
6. No menu de extensões do Chrome, fixe **Clio — Apoio à Pesquisa Histórica**.

Mantenha a pasta no computador após a instalação: o Chrome utiliza esses arquivos para executar a extensão.

## Como usar

1. Abra uma página de jornal no DocReader da Biblioteca Nacional e aguarde o carregamento da imagem.
2. Clique no ícone da Clio.
3. Escolha **Usar nome padrão** ou **Personalizar nome**.
4. Confira a prévia e clique em **Baixar imagem**.
5. Escolha onde salvar no computador.

O botão **Copiar dados da fonte** reúne o título do visualizador, os endereços da consulta e da imagem e a data de acesso. Complete a identificação bibliográfica com data e número da edição, página impressa, título e autoria da matéria, quando disponíveis.

Se mudar de página ou ajustar o zoom, reabra a extensão ou clique em **Atualizar**. A Clio baixa a resolução já carregada; não força uma imagem de maior resolução.

## Atualização

Substitua os arquivos da pasta instalada pela versão mais recente. Depois, abra `chrome://extensions` e clique em **Recarregar** no cartão da Clio. A instalação manual pelo GitHub exige atualização manual.

## Privacidade e permissões

A Clio não usa servidor próprio, telemetria ou código remoto. Os dados identificados são usados localmente para as ações solicitadas; o download se conecta ao endereço da imagem no acervo.

| Permissão | Finalidade |
| --- | --- |
| `activeTab` | Consultar a aba ativa após o clique do usuário. |
| `scripting` | Identificar a imagem e os dados disponíveis no visualizador. |
| `downloads` | Iniciar e acompanhar o download solicitado. |

## Compatibilidade e limites

A extensão foi desenvolvida para o visualizador DocReader nos domínios da Biblioteca Nacional, com o elemento de imagem `DocumentoImg`. Mudanças na estrutura do site podem exigir ajustes.

Caso não identifique a imagem, aguarde o carregamento e clique em **Atualizar**. Se o visualizador estiver incorporado em outro site, abra-o em uma aba própria. Se o download falhar, reabra a extensão para obter o endereço atual da imagem.

A Clio é um **projeto independente, sem vínculo oficial com a Biblioteca Nacional**. A consulta e o uso das fontes devem observar as condições do acervo e os direitos aplicáveis aos materiais.

## Ícone

O ícone de livro e lupa acompanha o projeto em PNG nos tamanhos 16, 32, 48 e 128 pixels. O desenho editável está em `icons/icone-fonte.svg`.

## Contato e sugestões

Encontrou um problema ou tem uma ideia? Abra uma **issue** no repositório, informando o que aconteceu, a versão da extensão e, quando possível, o link da página consultada.

Autoria e contato: [@pablohscarvalho](https://www.instagram.com/pablohscarvalho/).
