// 1680px max content height
tinymce.PluginManager.add("pagination", function (editor) {
  let pages = 1;
  let margin = 25.4;
  let elements = null;
  let pageLayout =
    '<div class="page"><div class="content"><p>&nbsp;</p></div></div>';

  editor.on("init", () => {
    editor.dom.addStyle(`html {
        background-image: url('data:image/svg+xml,<svg width="1286" height="1895" viewBox="0 0 1286 1895" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1286" height="1945" fill="%23D1D1D1"/><rect x="16" y="19.6373" width="1252" height="1905.73" fill="white"/></svg>');
      }`);

    applyDivStyle(margin, 1687);
  });

  editor.on("NodeChange", () => {
    elements = editor.getBody().childNodes;

    if (elements[0].className === "page" || elements[0].nodeName != "DIV") {
      if (elements[0].nodeName != "DIV") {
        editor.execCommand("mceSetContent", false, pageLayout);
      }

      let height = 0;
      elements.forEach((page) => {
        page.childNodes.forEach((elem) => {
          let styles = window.getComputedStyle(elem);
          height += parseFloat(styles["marginTop"]) + elem.offsetHeight;
        });
      });
      if (height > 1680 * pages) {
        pages++;
        removeLastParagraph(elements);
        if (pages != elements.length) {
          editor.execCommand(
            "mceSetContent",
            false,
            editor.getContent() + pageLayout
          );
          selectNewPageParagraph(elements);
        }
      } else if (pages > 1 && height <= 1680) {
        pages--;
      }
    }
  });

  //Util functions
  function applyDivStyle(margin, height) {
    let bodyStyle = `.page {
                        position: relative;
                        margin-bottom: 20px !important;
                        padding: 0  ${margin}mm !important; 
                        padding-top: ${margin}mm !important; 
                        padding-bottom: ${margin}mm !important;
                        height: ${height}px;
                        width: 1060px;
                      }`;
    editor.dom.addStyle(bodyStyle);
  }

  function selectNewPageParagraph() {
    let page = elements[elements.length - 1];
    let element = null;
    element = page.childNodes[0];
    editor.dom.add(element, 'p', {}, '&nbsp;');

    element = element.childNodes[0];
    
    editor.selection.setCursorLocation(element, 0);
  }

  // When the user break to a new page, a p tag is created off bounds, this remove it
  function removeLastParagraph() {
    let element = editor.selection.getNode();
    editor.dom.remove(element);
  }
});
