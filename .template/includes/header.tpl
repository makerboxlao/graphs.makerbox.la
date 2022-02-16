<!doctype html>
<html lang="en" charset="utf-8">
  <head>
    <meta lang="en" charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="description" content="Makerbox Lao - Power Graphs" />
    <meta name="author" content="LaoDC https://laodc.com/" />
<?php
    $title = 'Makerbox Lao - Power Graphs';

    if( !empty( $css ) )
    {
      if( is_array( $css ) )
      {
        foreach( $css as $c )
        {
          echo <<< HTML
    <link href="{$c}" media="all" rel="stylesheet" />

HTML;
        }
      }
      else
      {
        echo <<< HTML
    <link href="{$css}" media="all" rel="stylesheet" />

HTML;
      }
    }
?>
    <title><?= $title?></title>
    <link rel="canonical" href="https://<?= $_SERVER['SERVER_NAME'];?>" />
    <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" sizes="180x180" />
    <link rel="icon" href="/assets/img/cropped-mbl-favicon-512x512-1-32x32.png" sizes="32x32" />
    <link rel="icon" href="/assets/img/cropped-mbl-favicon-512x512-1-192x192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/assets/img/cropped-mbl-favicon-512x512-1-180x180.png" />
    <meta name="msapplication-TileImage" content="/assets/img/cropped-mbl-favicon-512x512-1-270x270.png" />
    <link href="/assets/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous" />
    <link href="/assets/css/site.css" rel="stylesheet" />
  </head>
  <body class="d-flex flex-column min-vh-100">
    <div class="px-3 py-2 pt-md-4 pb-md-4 mx-auto text-center">
      <img src="/assets/img/logo-mbl-300x116.png" style="width: 300px; height: 116px;" />
    </div>
    <div class="container flex-grow-1">
