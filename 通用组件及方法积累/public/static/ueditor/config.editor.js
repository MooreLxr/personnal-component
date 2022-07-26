define({
  toolbars: [
    [
      // "fullscreen",
      // 'source',
      // '|',
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'fontborder',
      'strikethrough',
      // "superscript",
      // "subscript",
      // "removeformat",
      // "formatmatch",
      // "autotypeset",
      // "blockquote",
      // "pasteplain",
      // "|",
      // "forecolor",
      // "backcolor",
      'insertorderedlist',
      // "insertunorderedlist",
      // "selectall",
      'cleardoc',
      // "|",
      // "rowspacingtop",
      // "rowspacingbottom",
      // "lineheight",
      // "|",
      // "customstyle",
      'paragraph',
      'fontfamily',
      'fontsize',
      // "|",
      // "directionalityltr",
      // "directionalityrtl",
      // "indent",
      '|',
      'justifyleft',
      'justifycenter',
      'justifyright',
      // "justifyjustify",
      '|',
      // "touppercase",
      // "tolowercase",
      // "|",
      // "link",
      // "unlink",
      // "anchor",
      // "|",
      // "imagenone",
      'imageleft',
      'imageright',
      'imagecenter',
      // "|",
      'simpleupload',
      // 'insertimage',
      // "emotion",
      // "scrawl",
      // 'insertvideo',
      // "music",
      // "attachment",
      // "map",
      // "gmap",
      // "insertframe",
      // "insertcode",
      // "webapp",
      // "pagebreak",
      // "template",
      // "background",
      // "|",
      // "horizontal",
      // "date",
      // "time",
      // "spechars",
      // "snapscreen",
      // "wordimage",
      // "|",
      'inserttable',
      'deletetable',
      // "insertparagraphbeforetable",
      'insertrow',
      'deleterow',
      'insertcol',
      'deletecol',
      'mergecells',
      'mergeright',
      'mergedown'
      // "splittocells",
      // "splittorows",
      // "splittocols",
      // "charts",
      // "|",
      // "print",
      // "preview",
      // "searchreplace",
      // "drafts",
      // "help",
      // 'contact'
    ]
  ],
  zIndex: 10,
  enableContextMenu: false,
  imageScaleEnabled: false, // 图片缩放框
  elementPathEnabled: false, // 不显示底部路径
  wordCount: true, // 是否显示字体个数
  autoHeightEnabled: false,
  autoFloatEnabled: false, // 是否工具栏可浮动
  initialContent: '', // 初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
  focus: false, // 初始化时，是否让编辑器获得焦点true或false
  autoClearinitialContent: true, // 是否自动清除编辑器初始内容，注意：如果focus属性设置为true,这个也为真，那么编辑器一上来就会触发导致初始化的内容看不到了
  initialFrameWidth: '100%',
  initialFrameHeight: 400,
  BaseUrl: '',
  UEDITOR_HOME_URL: '/scacs/static/ueditor/'
})
