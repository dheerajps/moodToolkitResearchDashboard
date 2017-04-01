<?php

/* 
---- Helps in zipping all the files inside each patient and creates a .zip files for to download on the button at Overview and User view for SLU
---- One of the files which needs to go into cron job later 
*/

/************* TECH DEBT ****************/
/****** TODO ::: CONVERT INTO FUNCTIONS AND MAKE IT EASY TO USE FOR ALL STUDIES ******/


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
   
    if (is_dir($source) === true)
    {
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

        foreach ($files as $file)
        {
            echo "the file inside the directory now being zipped is -------> " . $file . "\n";
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

$path = "/var/www/html/app/data/SLU_data/"; // '.' for current


foreach (new DirectoryIterator($path) as $file) {

    if ($file->isDot()) continue;

    if ($file->isDir()) {

        echo "The directory is ------> ". $file. "\n \n";
        $filePath = $path.$file;
	    foreach( new DirectoryIterator($filePath) as $nestedFile) {

            if($nestedFile -> isFile()){

                echo "The nested file is -----> ".$nestedFile."\n";
    			$sourcePath = $filePath."/".$nestedFile;
                echo "The source file is ---->".$sourcePath."\n";
    			$destinationPath = "/var/www/html/app/data/download/" . $file . ".zip";
    			Zip($sourcePath, $destinationPath);
    			$newPath = $filePath."/".$file."/".$nestedFile;
                if (!rename($sourcePath,$newPath)) {
                    if (!copy ($sourcePath,$newPath)) {
                        if(mkdir ($filePath."/".$file)){
                            copy ($sourcePath,$newPath);
                            unlink($sourcePath);
                        }
                    }
                    else{
                        unlink($sourcePath);
                    }
    		    }
            }

	       	else if($nestedFile -> isDir()){

                if ($nestedFile->isDot()) continue;

                else {
                    continue;
                   /* echo "The nested directory is -----> ".$nestedFile."\n";
            		$sourcePath = $path. $file ."/". $nestedFile;
                    echo "The source directory is ---->".$sourcePath."\n";
            		$destinationPath = "/var/www/html/app/data/download/" . $file . ".zip";
            		Zip($sourcePath, $destinationPath); // call the function for each source folder*/
                }
    		}
    	}
    }
}

?>
