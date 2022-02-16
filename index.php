<?php

  namespace MBL;

  require_once __DIR__ . '/vendor/autoload.php';

  session_start();

  const BASE_PATH = __DIR__;
  const CONF_PATH = BASE_PATH . '/.config';

  use Laodc\Router;
  use Laodc\Config\{Config,Tags};
  use Laodc\Container\Container;
  use Laodc\Database\Database;
  use Laodc\Template\Template;
  use Laodc\Functions\Functions;

  // Load up config system
  $config = Container::add(
    'config',
    ( function(): object {
      $c = new Config();
      $c->path( realpath( CONF_PATH ) );

      return $c;
    } )()
  );

  // tags for config files
  $tags = new Tags();
  $tags->add(
    '!dir',
    function( $value, $tag, $flags ): string {
      return realpath( __DIR__ . $value );
    }
  );

  // load up any site settings
  $settings = Container::add(
    'settings',
    $config->load( 'settings.yml' )
  );

  // configure database and connect to it
  $database = Container::add(
    'database',
    new Database( $config->load( 'database.yml' ) )
  );

  // configure template system
  $template = Container::add(
    'template',
    ( function() use( $config, $tags, $settings, $database ): object {
      
      $t = new Template( $config->load( 'template.yml', $tags ) );

      // prepare common template tags
      $t
        ->assign( 'js', [] )
        ->assign( 'css', [] )
      ;

      return $t;
    } )()
  );

  // configure the main URI router
  $router = Router\Router::parseConfig( $config->load( 'routes.yml', $tags ) );

  // trigger the router matching
  $router->matchCurrentRequest();

  // 404 if nothing matched
  $template->render( '404.tpl' );
