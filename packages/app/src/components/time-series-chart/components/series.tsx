import { TimestampedValue } from '@corona-dashboard/common';
import { ScaleLinear } from 'd3-scale';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import {
  Bounds,
  GetX,
  GetY,
  GetY0,
  GetY1,
  SeriesConfig,
  SeriesDoubleValue,
  SeriesList,
  SeriesSingleValue,
} from '../logic';
import { SplitBarTrend } from './split-bar-trend';
import { StackedAreaTrend } from './stacked-area-trend';
import React from 'react';
interface SeriesProps<T extends TimestampedValue> {
  seriesConfig: SeriesConfig<T>;
  seriesList: SeriesList;
  getX: GetX;
  /**
   * @TODO it's maybe not worth it creating the getY functions in the hook and
   * passing them along. Since we also need the yScale here anyway, we might as
   * well let each component make its own y getters based on yScale. GetX is
   * used in more places and is more universal so that might still be worth
   * passing along instead of xScale.
   */
  getY: GetY;
  getY0: GetY0;
  getY1: GetY1;
  yScale: ScaleLinear<number, number>;
  bounds: Bounds;
  chartId: string;
}

export const Series = memo(SeriesUnmemoized) as typeof SeriesUnmemoized;

function SeriesUnmemoized<T extends TimestampedValue>({
  seriesConfig,
  seriesList,
  getX,
  getY,
  getY0,
  getY1,
  yScale,
  bounds,
  chartId,
}: SeriesProps<T>) {
  return (
    <>
      {seriesList
        .map((series, index) => {
          const config = seriesConfig[index];
          const id =
            config.type === 'range'
              ? `${chartId}_${config.metricPropertyLow}_${config.metricPropertyHigh}`
              : `${chartId}_${config.metricProperty}`;

          switch (config.type) {
            case 'gapped-line':
              return React.createElement(
                dynamic(() =>
                  import('./gapped-line-trend').then(
                    (mod) => mod.GappedLinedTrend
                  )
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  style: config.style,
                  strokeWidth: config.strokeWidth,
                  curve: config.curve,
                  getX: getX,
                  getY: getY,
                  id: id,
                }
              );
            case 'line':
              return React.createElement(
                dynamic(() =>
                  import('./line-trend.tsx').then((mod) => mod.LineTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  strokeWidth: config.strokeWidth,
                  curve: config.curve,
                  getX: getX,
                  getY: getY,
                  yScale: yScale,
                  id: id,
                }
              );
            case 'area':
              return React.createElement(
                dynamic(() =>
                  import('./area-trend.tsx').then((mod) => mod.AreaTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  strokeWidth: config.strokeWidth,
                  curve: config.curve,
                  getX: getX,
                  getY: getY,
                  yScale: yScale,
                  id: id,
                }
              );
            case 'gapped-area':
              return React.createElement(
                dynamic(() =>
                  import('./gapped-area-trend').then(
                    (mod) => mod.GappedAreaTrend
                  )
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  strokeWidth: config.strokeWidth,
                  curve: config.curve,
                  getX: getX,
                  getY: getY,
                  yScale: yScale,
                  id: id,
                }
              );
            case 'bar':
              return React.createElement(
                dynamic(() =>
                  import('./bar-trend').then((mod) => mod.BarTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  getX: getX,
                  getY: getY,
                  bounds: bounds,
                  yScale: yScale,
                  id: id,
                }
              );

            case 'split-bar':
              return React.createElement(
                dynamic(() =>
                  import('./split-bar-trend').then((mod) => mod.SplitBarTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  splitPoints: config.splitPoints,
                  fillOpacity: config.fillOpacity,
                  getX: getX,
                  getY: getY,
                  bounds: bounds,
                  id: id,
                }
              );

            case 'range':
              return React.createElement(
                dynamic(() =>
                  import('./range-trend').then((mod) => mod.RangeTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  getX: getX,
                  getY0: getY0,
                  getY1: getY1,
                  bounds: bounds,
                  id: id,
                }
              );

            case 'gapped-stacked-area':
              return React.createElement(
                dynamic(() =>
                  import('./gapped-stacked-area-trend').then(
                    (mod) => mod.GappedStackedAreaTrend
                  )
                ),
                {
                  key: index,
                  series: series,
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  strokeWidth: config.strokeWidth,
                  mixBlendMode: config.mixBlendMode,
                  getX: getX,
                  getY0: getY0,
                  getY1: getY1,
                  bounds: bounds,
                  id: id,
                }
              );
            case 'stacked-area':
              return React.createElement(
                dynamic(() =>
                  import('./stacked-area-trend').then(
                    (mod) => mod.StackedAreaTrend
                  )
                ),
                {
                  key: index,
                  series: series,
                  color: config.color,
                  fillOpacity: config.fillOpacity,
                  strokeWidth: config.strokeWidth,
                  mixBlendMode: config.mixBlendMode,
                  getX: getX,
                  getY0: getY0,
                  getY1: getY1,
                  bounds: bounds,
                  id: id,
                }
              );
            case 'split-area':
              return React.createElement(
                dynamic(() =>
                  import('./split-area-trend').then((mod) => mod.SplitAreaTrend)
                ),
                {
                  key: index,
                  series: series as SeriesSingleValue[],
                  splitPoints: config.splitPoints,
                  strokeWidth: config.strokeWidth,
                  fillOpacity: config.fillOpacity,
                  getX: getX,
                  getY: getY,
                  yScale: yScale,
                  id: id,
                }
              );
          }
        })
        /**
         * We reverse the elements to ensure the first series will be rendered
         * as the last dom/svg-node. This way we make sure that the first (and
         * most-likely most important) series is actually rendered on top of the
         * other series.
         */
        .reverse()}
    </>
  );
}
