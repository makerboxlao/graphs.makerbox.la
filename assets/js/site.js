var conn;

( function() {
  'use strict';

  jQuery.extend( jQuery.expr[ ':' ], {
    invalid : function( elem, index, match ) {
      var invalids = document.querySelectorAll( ':invalid' ),
        result = false,
        len = invalids.length;

      if( len )
      {
        for( var i = 0; i < len; i++ )
        {
          if( elem === invalids[i] )
          {
            result = true;
            break;
          }
        }
      }
      return result;
    }
  } );

  var connect_websocket = function() {
    conn = new autobahn.Connection(
      {
        url: 'wss://' + location.host + '/payment',
        realm: 'payment_checker',
        skipSubprotocolCheck: true
      }
    );

    conn.onopen = function( session, details ) {
      function onupdate( args )
      {
        var result = args[args.length-1];
        if( 'success' == result.status )
        {
          $( '#ref' ).html( result.ticket );
          $( '.overlay' ).removeClass( 'd-none' );
          conn.close();
        }
      }

      function onping( response ) {};

      function ping( session )
      {
        session.call( 'ping', [] ).then(
          function( res ) {
            setTimeout(
              function() {
                ping( session );
              },
              5000
            );
          }
        );
      }

      session.subscribe( hash, onupdate );
      session.register( 'ping', onping );

      ping( session );
    };

    conn.onclose = function( reason, details ) {};
    conn.open();
  };

  window.addEventListener( 'load', function() {
    var forms = document.getElementsByClassName( 'needs-validation' );

    Array.prototype.filter.call( forms, function( form ) {
      if( 0 == $( "input[name='mbl_usage[]']:checked" ).length )
      {
        // nothing was selected
        $( "input[name='mbl_usage[]" ).each( function() {
          this.setCustomValidity( 'You must select at least one option.' );
        } );
      }

      form.addEventListener( 'submit', function( event ) {
        if( form.checkValidity() === false )
        {
          event.preventDefault();
          event.stopPropagation();

          if( $( "input[name='mbl_usage[]']" ).is( ':invalid' ) )
            $( "#mbl_usage" ).show();

          $( '#errors' ).removeClass( 'd-none' );
          $( 'html, body' ).scrollTop( $( '#errors' ).offset().top );
        }

        form.classList.add( 'was-validated' );
      }, false);
    } );
  }, false );

  $( "input[name='mbl_usage[]']" ).on( 'click', function() {
    // reset
    $( "input[name='mbl_usage[]" ).each( function() {
      this.setCustomValidity( '' );
    } );

    $( "#mbl_usage" ).hide();

    var forms = document.getElementsByClassName( 'needs-validation' );
    // reset
    Array.prototype.filter.call( forms, function( form ) {
      form.classList.remove( 'was-validated' );
    } );

    // prep error if nothing has been selected so far
    if( 0 == $( "input[name='mbl_usage[]']:checked" ).length )
    {
      $( "input[name='mbl_usage[]" ).each( function() {
        this.setCustomValidity( 'You must select at least one option.' );
      } );
    }
  } );

  $( 'input[type=radio][name=donate_amount]' ).change( function() {
    switch( $( this ).val().toLowerCase() )
    {
      case 'donate_lak':
        $( '#donation_lak' ).prop( 'disabled', false );
        $( '#submit' ).html( 'Proceed to payment &raquo;' );
        $( '.breadcrumb' ).html( 'Step 3 of 4' );
        break;
      case 'donate_none':
        $( '#submit' ).html( 'Register &raquo;' );
        $( '.breadcrumb' ).html( 'Step 3 of 3' );
        break;
      default:
        $( '#donation_lak' ).prop( 'disabled', true );
        $( '#submit' ).html( 'Proceed to payment &raquo;' );
        $( '.breadcrumb' ).html( 'Step 3 of 4' );
        break;
    }
  } );

  // fancy format currency fields
  $( 'input[type="currency"]' ).on( 'focus', function( e ) {
    var value = e.target.value;
    e.target.value = value ? localStringToNumber( value ) : '';
  } );

  $( 'input[type="currency"]' ).on( 'blur', function( e ) {
    var value = e.target.value;

    var options = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    };
    
    e.target.value = ( value || value === 0 ) 
      ? localStringToNumber( value ).toLocaleString( undefined, options )
      : '';
  } );

  // force blur trigger
  $( 'input[type="currency"]' ).trigger( 'blur' );

  function localStringToNumber( s )
  {
    return Number( String( s ).replace(/[^0-9.-]+/g, '' ) );
  }

  if( true == $( '.overlay' ).data( 'ws' ) )
  {
    connect_websocket();
  };

} )();

var discount_percent = 0;

function calculateTotals()
{
  var package_price = 0;
  var shipping_price = 0;
  var discount_amount = 0;
  var total_price = package_price + shipping_price - discount_amount;

  var check_shipping = false;
  var apply_discount = true;

  switch( $( 'input[name=race_package]:checked' ).val() )
  {
    case 'only_registration':
      package_price = 200000;
      shipping_price = 0;
      total_price = package_price + shipping_price;

      $( 'span', '#price-package' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( package_price ) + '&#8365;' );
      $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );
      break;
    case 'race_pack':
      package_price = 300000;
      total_price = package_price + shipping_price;

      check_shipping = true;

      $( 'span', '#price-package' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( package_price ) + '&#8365;' );
      $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );
      break;
    case 'donation':
      package_price = parseInt( $( '#donation_amount' ).val() || '0' );
      shipping_price = 0;
      total_price = package_price + shipping_price;

      apply_discount = false;
      $( '#price-discount' ).removeClass( 'd-flex' ).addClass( 'd-none' );

      $( 'span', '#price-package' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( package_price ) + '&#8365;' );
      $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );
      break;
  }

  shipping_price = 0;
  if( true == check_shipping )
  {
    switch( $( 'input[name=shipping_method]:checked' ).val() )
    {
      case 'delivery':
        shipping_price = 15000;
        total_price = package_price + shipping_price;

        $( 'span', '#price-shipping' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( shipping_price ) + '&#8365;' );
        $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );
        break;
      case 'pickup':
        shipping_price = 0;
        total_price = package_price + shipping_price;

        $( 'span', '#price-shipping' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( shipping_price ) + '&#8365;' );
        $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );
        break;
    }
  }

  if( true == apply_discount && discount_percent > 0 )
  {
    discount_amount = package_price * ( discount_percent / 100 );
    total_price = package_price + shipping_price - discount_amount;

    var disc = new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( discount_amount );

    $( '#price-discount' ).removeClass( 'd-none' ).addClass( 'd-flex' );
    $( 'span', '#price-discount' ).html( '-' + disc + '&#8365;' );
    $( 'strong', '#price-total' ).html( new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 0 } ).format( total_price ) + '&#8365;' );

    $( '#received_amount' ).val( total_price );
    $( '#received_discount' ).html( '(' + discount_percent + '% discount)' );
  }
}
