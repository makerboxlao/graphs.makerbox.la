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

      $sql = sprintf( '
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

      $sql_avg = sprintf( '
        SELECT
          phase,
          timestamp,
          AVG( voltage ) AS avg_voltage,
          AVG( current ) AS avg_current,
          AVG( energy ) AS avg_energy,
          AVG( power ) AS avg_power,
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

      $kwh = [];
      foreach( $db->fetchAll( $sql_daily ) as $record )
      {
        $kwh[$record['phase']][] = $record;
      }

      $t
        ->assign( 'phases', $phases )
        ->assign( 'kwh', $kwh )
        ->render( 'mdb.tpl' );
    }
  }
