<?php

/**
 * jQuery File Tree PHP Connector
 *
 * Version 2.0.0
 *
 * @author - Cory S.N. LaViska A Beautiful Site (http://abeautifulsite.net/)
 * @author - Dave Rogers - https://github.com/daverogers/jQueryFileTree
 * @author - Lucian Nunu
 *
 * History:
 *
 * 2.0.0 - update to clean code (12/13/2014)
 * 1.1.0 - adding multiSelect (checkbox) support (08/22/2014)
 * 1.0.2 - fixes undefined 'dir' error - by itsyash (06/09/2014)
 * 1.0.1 - updated to work with foreign characters in directory/file names (12 April 2008)
 * 1.0.0 - released (24 March 2008)
 *
 * Output a list of files for jQuery File Tree
 */
$dir = urldecode((isset($_POST['dir']) ? $_POST['dir'] : null));

// set checkbox if multiSelect set to true
$checkbox = ( isset($_POST['multiSelect']) && $_POST['multiSelect'] == 'true' ) ? "<input type='checkbox' />" : null;

function scanRecursive($dir, $checkbox){
    
    if (file_exists($dir)) {
        $scan = array_diff(scandir($dir), array('..', '.'));

        if (count($scan)) {

            $directories = array();
            $files = array();

            foreach ($scan as $item) {
                if (is_dir($dir . $item)) {
                    $directories[] = $item;
                } else {
                    $files[] = $item;
                }
            }

            echo '<ul class="jqueryFileTree">';

            foreach ($directories as $file) {
                echo "<li class='directory collapsed'>{$checkbox}<a href='#' rel='" . htmlentities($dir . $file) . "/'>" . htmlentities($file) . "</a>";
                echo scanRecursive($dir . $file . '/', $checkbox);
                echo "</li>";
            }

            foreach ($files as $file) {
                $ext = preg_replace('/^.*\./', '', $file);
                echo "<li class='file ext_{$ext}'>{$checkbox}<a href='#' rel='" . htmlentities($dir . $file) . "'>" . htmlentities($file) . "</a></li>";
            }

            echo '</ul>';
        }
    }
}

scanRecursive($dir, $checkbox);


