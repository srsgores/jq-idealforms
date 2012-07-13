/**
 * A custom <input type="file"> jQuery plugin
 * @example `$(':file').toCustomFile()`
 */
$.fn.tabs = function (ops) {

  var

  // Options
  o = $.extend({
    tabContainer: ''
  }, ops),

  // Elements
  $contents = this,
  $container = $(o.tabContainer),
  $wrapper = $('<ul class="ideal-tabs-wrap"/>'),
  $tabs = (function () {
    var tabs = []
    $contents.each(function () {
      var $fs = $(this),
          name = $fs.attr('name'),
          html =
            '<li class="ideal-tabs-tab">'+
              name +
              '<i class="ideal-tabs-tab-counter"></i>'+
            '</li>'
      tabs.push(html)
    })
    return $(tabs.join(''))
  }()),

  Actions = {
    getCurIdx: function () {
      return $tabs
        .filter('.ideal-tabs-tab-active')
        .index()
    },
    getTabIdxByName: function (name) {
      var
      re = new RegExp(name, 'i'),
      $tab = $tabs.filter(function () {
        return re.test($(this).text())
      }),
      idx = $tab.index()
      return idx
    }
  },

  /**
   * Public methods
   */
  Methods = {
    /**
     * Switch tab
     */
    switchTab: function (ops) {
      var

      def = $.extend({
        name: '',
        idx: null
      }, ops),

      idx = def.idx !== null
        ? def.idx
        : Actions.getTabIdxByName(def.name)

      $tabs.removeClass('ideal-tabs-tab-active')
      $tabs.eq(idx).addClass('ideal-tabs-tab-active')

      if (!$contents.eq(idx).is(':visible'))
        $contents
          .hide().eq(idx)
          .fadeTo(0, 0)
          .show()
          .fadeTo('normal', 1)
    },

    nextTab: function () {
      var idx = Actions.getCurIdx() + 1
      if (idx > $tabs.length - 1)
        Methods.firstTab()
      else
        Methods.switchTab({ idx: idx })
    },

    prevTab: function () {
      var idx = Actions.getCurIdx() - 1
      Methods.switchTab({ idx: idx })
    },

    firstTab: function () {
      Methods.switchTab({ idx: 0 })
    },

    lastTab: function () {
      Methods.switchTab({ idx: $tabs.length - 1 })
    },

    updateCounter: function (name, text) {
      var idx = Actions.getTabIdxByName(name),
          $counter = $tabs.eq(idx).find('.ideal-tabs-tab-counter')
      $counter.removeClass('ideal-tabs-tab-counter-zero')
      if (Number(text) === 0)
        $counter.addClass('ideal-tabs-tab-counter-zero')
      $counter
        .attr('title', 'Invalid fields')
        .html(text)
    }
  }

  // Attach methods
  for (var m in Methods)
    $contents[m] = Methods[m]

  // Init
  $tabs
    .first()
    .addClass('ideal-tabs-tab-active')
    .end()
    .click(function () {
      var name = $(this).text()
      $contents.switchTab({ name: name })
    })

  // Insert in DOM & Events

  $wrapper
    .append($tabs)
    .appendTo($container)

  $contents
    .addClass('ideal-tabs-content')
    .each(function () {
      var $this = $(this),
          name = $(this).attr('name')
      $this
        .data('ideal-tabs-content-name', name)
        .removeAttr('name')
    })
    .hide().first().show() // Start fresh

  return $contents

}