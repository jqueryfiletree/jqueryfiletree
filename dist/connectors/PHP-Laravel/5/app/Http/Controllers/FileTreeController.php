<?php

/**
 * Jquery File Tree PHP-Laravel-5.* Controller
 *
 * @version 1.0.0
 *
 * @author - Jean Jar - https://github.com/jeanjar/
 *
 * History
 *
 * 1.0.0 - released (01 Jun 2016)
 *
 * @return Html
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class FileTreeController extends Controller
{
    public function index(Request $request)
    {

        $root = public_path() . DIRECTORY_SEPARATOR;
        $postDir = rawurldecode(public_path($request->get('dir')));

        if (file_exists($postDir))
        {

            $files = scandir($postDir);
            $returnDir = substr($postDir, strlen($root));
            natcasesort($files);

            if (count($files) > 2)
            { // The 2 accounts for . and ..
                echo "<ul class='jqueryFileTree'>";
                foreach ($files as $file)
                {
                    $htmlRel = htmlentities($returnDir . $file);
                    $htmlName = htmlentities($file);
                    $ext = preg_replace('/^.*\./', '', $file);
                    if (file_exists($postDir . $file) && $file != '.' && $file != '..')
                    {
                        if (is_dir($postDir . $file))
                        {
                            echo "<li class='directory collapsed'><a rel='" . $htmlRel . "/'>" . $htmlName . "</a></li>";
                        }
                        else
                        {
                            echo "<li class='file ext_{$ext}'><a rel='" . $htmlRel . "'>" . $htmlName . "</a></li>";
                        }
                    }
                }
                echo "</ul>";
            }
        }
    }
}
