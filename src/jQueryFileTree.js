
/*
  * jQueryFileTree Plugin
  *
  * @author - Cory S.N. LaViska - A Beautiful Site (http://abeautifulsite.net/) - 24 March 2008
  * @author - Dave Rogers - https://github.com/daverogers/jQueryFileTree
  *
  * Usage: $('.fileTreeDemo').fileTree({ options }, callback )
  *
  * TERMS OF USE
  *
  * This plugin is dual-licensed under the GNU General Public License and the MIT License and
  * is copyright 2008 A Beautiful Site, LLC.
 */
(function($, window) {
  var FileTree;
  FileTree = (function() {
    function FileTree(el, args, callback) {
      var $el, defaults;
      $el = $(el);
      defaults = {
        root: '/',
        script: '/files/filetree',
        folderEvent: 'click',
        expandSpeed: 500,
        collapseSpeed: 500,
        expandEasing: 'swing',
        collapseEasing: 'swing',
        multiFolder: true,
        loadMessage: 'Loading...',
        errorMessage: 'Unable to get file tree information',
        multiSelect: false,
        onlyFolders: false,
        onlyFiles: false
      };
      this.jqft = {
        container: $el
      };
      this.options = $.extend(defaults, args);
      this.callback = callback;
      $el.html('<ul class="jqueryFileTree start"><li class="wait">' + this.options.loadMessage + '<li></ul>');
      this.showTree($el, escape(this.options.root));
      $el.delegate("li a", this.options.folderEvent, (function(_this) {
        return function(event) {
          var $ev, data, jqft, options, ref;
          $ev = $(event.target);
          options = _this.options;
          jqft = _this.jqft;
          _this = _this;
          callback = _this.callback;
          data = {};
          data.li = $ev.closest('li');
          data.type = (ref = data.li.hasClass('directory')) != null ? ref : {
            'directory': 'file'
          };
          data.value = $ev.text();
          data.rel = $ev.prop('rel');
          data.container = jqft.container;
          if ($ev.parent().hasClass('directory')) {
            if ($ev.parent().hasClass('collapsed')) {
              _this._trigger($ev, 'filetreeexpand', data);
              if (!options.multiFolder) {
                $ev.parent().parent().find('UL').slideUp({
                  duration: options.collapseSpeed,
                  easing: options.collapseEasing
                });
                $ev.parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
              }
              $ev.parent().removeClass('collapsed').addClass('expanded');
              $ev.parent().find('UL').remove();
              _this.showTree($ev.parent(), $ev.attr('rel'));
              return _this._trigger($ev, 'filetreeexpanded', data);
            } else {
              _this._trigger($ev, 'filetreecollapse', data);
              $ev.parent().find('UL').slideUp({
                duration: options.collapseSpeed,
                easing: options.collapseEasing
              });
              $ev.parent().removeClass('expanded').addClass('collapsed');
              return _this._trigger($ev, 'filetreecollapsed', data);
            }
          } else {
            if (!options.multiSelect) {
              jqft.container.find('li').removeClass('selected');
              $ev.parent().addClass('selected');
            } else {
              if ($ev.parent().find('input').is(':checked')) {
                $ev.parent().find('input').prop('checked', false);
                $ev.parent().removeClass('selected');
              } else {
                $ev.parent().find('input').prop('checked', true);
                $ev.parent().addClass('selected');
              }
            }
            _this._trigger($ev, 'filetreeclicked', data);
            return typeof callback === "function" ? callback($ev.attr('rel')) : void 0;
          }
        };
      })(this));
    }

    FileTree.prototype.showTree = function(el, dir) {
      var $el, _this, data, handleFail, handleResult, options, result;
      $el = $(el);
      options = this.options;
      _this = this;
      $el.addClass('wait');
      $(".jqueryFileTree.start").remove();
      data = {
        dir: dir,
        onlyFolders: options.onlyFolders,
        onlyFiles: options.onlyFiles,
        multiSelect: options.multiSelect
      };
      handleResult = function(result) {
        var li;
        $el.find('.start').html('');
        $el.removeClass('wait').append(result);
        if (options.root === dir) {
          $el.find('UL:hidden').show(typeof callback !== "undefined" && callback !== null);
        } else {
          if (jQuery.easing[options.expandEasing] === void 0) {
            console.log('Easing library not loaded. Include jQueryUI or 3rd party lib.');
            options.expandEasing = 'swing';
          }
          $el.find('UL:hidden').slideDown({
            duration: options.expandSpeed,
            easing: options.expandEasing
          });
        }
        li = $('[rel="' + decodeURIComponent(dir) + '"]').parent();
        if (options.multiSelect && li.children('input').is(':checked')) {
          li.find('ul li input').each(function() {
            $(this).prop('checked', true);
            return $(this).parent().addClass('selected');
          });
        }
        return false;
      };
      handleFail = function() {
        $el.find('.start').html('');
        $el.removeClass('wait').append("<p>" + options.errorMessage + "</p>");
        return false;
      };
      if (typeof options.script === 'function') {
        result = options.script(data);
        if (typeof result === 'string' || result instanceof jQuery) {
          return handleResult(result);
        } else {
          return handleFail();
        }
      } else {
        return $.ajax({
          url: options.script,
          type: 'POST',
          dataType: 'HTML',
          data: data
        }).done(function(result) {
          return handleResult(result);
        }).fail(function() {
          return handleFail();
        });
      }
    };

    FileTree.prototype._trigger = function(el, eventType, data) {
      var $el;
      $el = $(el);
      return $el.trigger(eventType, data);
    };

    return FileTree;

  })();
  return $.fn.extend({
    fileTree: function(args, callback) {
      return this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data('fileTree');
        if (!data) {
          $this.data('fileTree', (data = new FileTree(this, args, callback)));
        }
        if (typeof args === 'string') {
          return data[option].apply(data);
        }
      });
    }
  });
})(window.jQuery, window);
