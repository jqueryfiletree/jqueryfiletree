<?php
//
// jQuery File Tree PHP Connector
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 24 March 2008
//
// History:
//
// 1.01 - updated to work with foreign characters in directory/file names (12 April 2008)
// 1.00 - released (24 March 2008)
//
// Output a list of files for jQuery File Tree
//

$_POST['dir'] = rawurldecode((isset($_POST['dir']) ? $_POST['dir'] : null ));

if( file_exists($_POST['dir']) ) {
   $files = scandir($_POST['dir']);
   natcasesort($files);
   if( count($files) > 2 ) { /* The 2 accounts for . and .. */
      echo "<ul class=\"jqueryFileTree\" style=\"display: none;\">";
      foreach( $files as $file ) {
         $Path = $_POST['dir'] . $file;
         if(!file_exists($Path) || $file == '.' || $file == '..') {
            continue;
         }
         //The following lines will take care of character encoding of special characters on a windows server.
         //Since special characters (é for example) are not displayed correctly when a file containing this character is found on a windows server.
         //The windows-1252 encoding returned by scandir() does not display correctly in HTML, so we need to convert it to UTF-8
         //See http://stackoverflow.com/questions/22660797/ for full details
         //WARNING: If you have a script running (instead of directly linking to files) to send your scripts, you have to run a reverse encoding conversion over the string passed by jQueryFileTree
         //Use the following line to revert the encoding conversion:
         // $FilePath = iconv(mb_detect_encoding($FilePath),"WINDOWS-1252",$FilePath);
         $file = iconv(mb_detect_encoding($file,array("WINDOWS-1252","UTF-8"),true),'UTF-8',$file);
         $Dir = iconv(mb_detect_encoding($_POST['dir'],array("WINDOWS-1252","UTF-8"),true),'UTF-8',$_POST['dir']);
         $RelString = htmlentities($Dir.$file);
         if(is_dir($Path)) {
            //Handle directories
            echo "<li class=\"directory collapsed\"><a href=\"javascript:void(0);\" rel=\"{$RelString}/\">" . htmlentities($file) . "</a></li>";
         }
         else {
            //Handle files
            $ext = preg_replace('/^.*\./', '', $file);
            echo "<li class=\"file ext_$ext\"><a href=\"javascript:void(0);\" rel=\"{$RelString}\">" . htmlentities($file) . "</a></li>";
         }
      }
      echo "</ul>";  
   }
}

?>