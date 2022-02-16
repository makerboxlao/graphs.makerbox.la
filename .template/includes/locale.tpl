<nav id="nav" class="lang">
          <ul>
            <li class="dropdown language-selector">
              <ul class="dropdown-menu pull-right">
<?php
              use Laodc\Container\Container;

              foreach( $locales as $l )
              {
                $base = ( 'en' !== $l['short'] ) ? '/' . $l['short'] : '';
                $active = ( $lang_short == $l['short'] ) ? ' class="active"' : '';
                $text = Container::get( 'locales' )->_( $l['short'], $l['name'] );

                echo <<< HTML
                <li{$active}>
                  <a lang="{$l['short']}" href="{$base}{$uri}" title="{$l['name']}" class="{$l['short']}">
                    <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
                    <span>{$text}</span>
                  </a>
                </li>

HTML;
            }

?>
              </ul>
              <a lang="<?=$lang_short;?>" href="javascript:void(0);" class="<?=$lang_short;?> dropdown-toggle" data-toggle="dropdown" data-close-others="true">
                <img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" />
              </a>
            </li>
          </ul>
        </nav>
