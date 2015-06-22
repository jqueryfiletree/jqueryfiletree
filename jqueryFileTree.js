/**
 * jQuery File Tree Plugin
 *
 * @author - Cory S.N. LaViska - A Beautiful Site (http://abeautifulsite.net/) - 24 March 2008
 * @author - Dave Rogers - https://github.com/daverogers/jQueryFileTree
 *
 *
 * Usage: $('.fileTreeDemo').fileTree( options, callback )
 *
 * Options:  root           - root folder to display; default = /
 *           script         - location of the serverside AJAX file to use; default = jqueryFileTree.php
 *           folderEvent    - event to trigger expand/collapse; default = click
 *           expandSpeed    - default = 500 (ms); use -1 for no animation
 *           collapseSpeed  - default = 500 (ms); use -1 for no animation
 *           expandEasing   - easing function to use on expand (optional)
 *           collapseEasing - easing function to use on collapse (optional)
 *           multiFolder    - whether or not to limit the browser to one subfolder at a time
 *           loadMessage    - Message to display while initial tree loads (can be HTML)
 *           multiSelect    - append checkbox to each line item to select more than one
 *           onlyFolders    - show only folders
 *
 *
 * TERMS OF USE
 *
 * This plugin is dual-licensed under the GNU General Public License and the MIT License and
 * is copyright 2008 A Beautiful Site, LLC.
 */

if(jQuery) (function($){

	$.extend($.fn, {
		fileTree: function(options, file) {
			// Default options
			if( options.root			=== undefined ) options.root			= '/';
			if( options.script			=== undefined ) options.script			= '/files/filetree';
			if( options.folderEvent		=== undefined ) options.folderEvent		= 'click';
			if( options.expandSpeed		=== undefined ) options.expandSpeed		= 500;
			if( options.collapseSpeed	=== undefined ) options.collapseSpeed	= 500;
			if( options.expandEasing	=== undefined ) options.expandEasing	= null;
			if( options.collapseEasing	=== undefined ) options.collapseEasing	= null;
			if( options.multiFolder		=== undefined ) options.multiFolder		= true;
			if( options.loadMessage		=== undefined ) options.loadMessage		= 'Loading...';
			if( options.multiSelect		=== undefined ) options.multiSelect		= false;
			if( options.onlyFolders		=== undefined ) options.onlyFolders		= false;
			if( options.onlyFiles		=== undefined ) options.onlyFiles		= false;

			// internal vars
			var jqft = {
				initiatorClass: null
			}

			$(this).each( function() {

				function showTree(element, dir) {
					$(element).addClass('wait');
					$(".jqueryFileTree.start").remove();
					$.post(options.script,
					{
						dir: dir,
						onlyFolders: options.onlyFolders,
						onlyFiles: options.onlyFiles,
						multiSelect: options.multiSelect
					})
					.done(function(data){
						$(element).find('.start').html('');
						$(element).removeClass('wait').append(data);
						if( options.root == dir ) $(element).find('UL:hidden').show(); else $(element).find('UL:hidden').slideDown({ duration: options.expandSpeed, easing: options.expandEasing });
						bindTree(element);

						// if multiselect is on and the parent folder is selected, propagate check to child elements
						var li = $('[rel="'+decodeURIComponent(dir)+'"]').parent();
						if( options.multiSelect && li.children('input').is(':checked') ) {
							li.find('ul li input').each(function() {
								$(this).prop('checked', true);
								$(this).parent().addClass('selected');
							});
						}

						_trigger($(this), 'filetreeexpanded', data);
					})
					.fail(function(){
						$(element).find('.start').html('');
						$(element).removeClass('wait').append("<li>Unable to get file tree information</li>");
					});
				}

				function bindTree(element) {
					$(element).find('LI A').on(options.folderEvent, function() {
						// set up data object to send back via trigger
						var data = {};
						data.li = $(this).closest('li');
						data.type = ( data.li.hasClass('directory') ? 'directory' : 'file' );
						data.value	= $(this).text();
						data.rel	= $(this).prop('rel');

						if( $(this).parent().hasClass('directory') ) {
							if( $(this).parent().hasClass('collapsed') ) {
								// Expand
								_trigger($(this), 'filetreeexpand', data);

								if( !options.multiFolder ) {
									$(this).parent().parent().find('UL').slideUp({ duration: options.collapseSpeed, easing: options.collapseEasing });
									$(this).parent().parent().find('LI.directory').removeClass('expanded').addClass('collapsed');
								}

								$(this).parent().removeClass('collapsed').addClass('expanded');
								$(this).parent().find('UL').remove(); // cleanup
								showTree( $(this).parent(), encodeURIComponent($(this).attr('rel').match( /.*\// )) );
							} else {
								// Collapse
								_trigger($(this), 'filetreecollapse', data);

								$(this).parent().find('UL').slideUp({ duration: options.collapseSpeed, easing: options.collapseEasing });
								$(this).parent().removeClass('expanded').addClass('collapsed');

								_trigger($(this), 'filetreecollapsed', data);
							}
						} else {
							// this is a file click, return file information
							file($(this).attr('rel'));

							if( !options.multiSelect ) {
								// remove "selected" class if set, then append class to currently selected file
								$('div[class="'+jqft.initiatorClass+'"]').find('li').removeClass('selected');
								$(this).parent().addClass('selected');
							} else {
								// since it's multiselect, more than one element can have the 'selected' class
								if( $(this).parent().find('input').is(':checked') ) {
									$(this).parent().find('input').prop('checked', false);
									$(this).parent().removeClass('selected');
								} else
								{
									$(this).parent().find('input').prop('checked', true);
									$(this).parent().addClass('selected');
								}
							}

							_trigger($(this), 'filetreeclicked', data);
						}
						return false;
					});
					// Prevent A from triggering the # on non-click events
					if( options.folderEvent.toLowerCase != 'click' ) $(element).find('LI A').on('click', function() { return false; });
				}

				// Loading message
				$(this).html('<ul class="jqueryFileTree start"><li class="wait">' + options.loadMessage + '<li></ul>');

				// store the intiator class
				jqft.initiatorClass = $(this).attr('class');

				// Get the initial file list
				showTree( $(this), escape(options.root) );

				// wrapper to append trigger type to data
				function _trigger(element, eventType, data) {
					data.trigger = eventType;
					element.trigger(eventType, data);
				}

				// checkbox event (multiSelect)
				$(this).on('change', 'input:checkbox' , function(){
					var data = {};
					data.li		= $(this).closest('li');
					data.type	= ( data.li.hasClass('directory') ? 'directory' : 'file' );
					data.value	= data.li.children('a').text();
					data.rel	= data.li.children('a').prop('rel');

					// propagate check status to (visible) child checkboxes
					data.li.find('input:checkbox').prop( 'checked', $(this).prop('checked') );

					// set trigger
					if( $(this).prop('checked') ) {
						data.li.addClass('selected');				// add 'selected' class
						data.li.find('li').addClass('selected');	// also add to children
						_trigger($(this), 'filetreechecked', data);
					} else {
						data.li.removeClass('selected');
						data.li.find('li').removeClass('selected');
						_trigger($(this), 'filetreeunchecked', data);
					}
				});
			});
		}
	});

})(jQuery);
