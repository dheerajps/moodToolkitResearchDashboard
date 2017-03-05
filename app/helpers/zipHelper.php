<? php

/* 
---- Helps in zipping all the files inside each patient and creates a .zip files for to download on the button at Overview and User view for SLU
---- One of the files which needs to go into cron job later 
*/

function Zip($source, $destination)
{
    //echo $source;
    if (!extension_loaded('zip') || !file_exists($source)) {
        return false;
    }
    $zip = new ZipArchive();
    if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
        return false;
        echo "hi";
    }
    $source = str_replace('/', '/', realpath($source));
    echo $source;
    if (is_dir($source) === true)
    {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

        foreach ($files as $file)
        {
            $file = str_replace('/','/', $file);
            // Ignore "." and ".." folders
            if( in_array(substr($file, strrpos($file, '/')+1), array('.', '..')) )
                continue;
            $file = realpath($file);
            if (is_dir($file) === true)
            {
                $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
            }
            else if (is_file($file) === true)
            {
                $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
            }
        }
    }
    else if (is_file($source) === true)
    {
        $zip->addFromString(basename($source), file_get_contents($source));
    }
    return $zip->close();
}

$path = '../data/SLU_data/'; // '.' for current

foreach (new DirectoryIterator($path) as $file) {
    if ($file->isDot()) continue;

    if ($file->isDir()) {
        
        $sourcePath = "../data/SLU_data/" . $file;
        $destinationPath = "../data/SLU_data/download/" . $file . ".zip";
        Zip($sourcePath, $destinationPath); // call the function for each source folder

    }
}



?>