<?php

  namespace MBL\Controller;

  use Laodc\Container\Container;
  use Laodc\Functions\Functions;

  class Mdb
  {
    public function index()
    {
      $t = Container::get( 'template' );

      $db = Container::get( 'database' );

      // If you want to display every minute of data
      /*
      $sql_raw = sprintf( '
        SELECT
          *
        FROM
          mdb_power
        WHERE
          timestamp >= CURDATE() - INTERVAL 7 DAY
        ORDER BY
          timestamp, phase
        '
      );
      */

      $sql_avg = sprintf( '
        SELECT
          phase,
          timestamp,
          AVG( voltage ) AS avg_voltage,
          AVG( current ) AS avg_current,
          AVG( energy ) AS avg_energy,
          AVG( power ) / 1000 AS avg_power,
          AVG( pf ) AS avg_pf,
          ROUND( UNIX_TIMESTAMP( timestamp ) / ( 5 * 60 ) ) AS timekey
        FROM
          mdb_power
        WHERE
          timestamp >= CURDATE() - INTERVAL 7 DAY
        GROUP BY
          phase, timekey
        ORDER BY
          timekey, phase
        '
      );

      $phases = [];
      foreach( $db->fetchAll( $sql_avg ) as $record )
      {
        $phases[$record['phase']][] = $record;
      }

      // Grab daily consumption of energy by getting the lowest and highest
      // levels for the day and subtracting to get the usage
      $sql_daily = sprintf( '
        SELECT
          phase,
          DATE( timestamp ) as date,
          ( MAX( energy ) - MIN( energy ) ) as total_e
        FROM
          mdb_power
        WHERE
          timestamp >= CURDATE() - INTERVAL 30 DAY
        GROUP BY
          phase, date
        ORDER BY
          date, phase
        '
      );

      $daily = [];
      foreach( $db->fetchAll( $sql_daily ) as $record )
      {
        $daily[$record['phase']][] = $record;
      }

      // Grab daily consumption of energy by getting the lowest and highest
      // levels for the day and subtracting to get the usage
      $sql_monthly = sprintf( '
        SELECT
          phase,
          CONCAT( YEAR( timestamp ), "-", LPAD( MONTH( timestamp ), 2, 0 ) ) as date,
          ( MAX( energy ) - MIN( energy ) ) AS total_e
        FROM
          mdb_power
        GROUP BY
          phase, YEAR( timestamp ), MONTH( timestamp )
        ORDER BY
          timestamp, phase
        '
      );

      $monthly = [];
      foreach( $db->fetchAll( $sql_monthly ) as $record )
      {
        $monthly[$record['phase']][] = $record;
      }

      $t
        ->assign( 'phases', $phases )
        ->assign( 'daily', $daily )
        ->assign( 'monthly', $monthly )
        ->render( 'mdb.tpl' );
    }
  }
