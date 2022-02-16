<?php

  namespace MBL\Controller;

  use Laodc\Container\Container;
  use Laodc\Functions\Functions;

  class Home
  {
    public function index()
    {
      $t = Container::get( 'template' );

      $t
        ->render( 'home.tpl' );
    }
  }