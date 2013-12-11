<?php
    $dst_w = $_POST['width'];
    $dst_h = $_POST['height'];
    $img_path = $_POST['path'];

    $quality = 80;

    $src_path = $img_path;
    
    $src_image = imagecreatefromjpeg($src_path);
    list($src_w, $src_h) = getimagesize($src_path);

    $dst_image = imagecreatetruecolor($dst_w, $dst_h);

    imagecopy($dst_image, $src_image, 0, 0, $_POST['x'], $_POST['y'], $src_w, $src_h);

    imagedestroy($src_image);

    header('Content-type: image/jpeg');

    imagejpeg($dst_image, null, $quality);

    imagedestroy($dst_image);

    exit();
?>