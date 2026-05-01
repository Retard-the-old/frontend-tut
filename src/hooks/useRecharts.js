import { useState, useEffect } from "react";

function useRecharts() {
  var _Rc = useState(null); var Rc = _Rc[0]; var setRc = _Rc[1];
  useEffect(function(){ import("recharts").then(function(m){ setRc(m); }); }, []);
  var N = function(){ return null; };
  return {
    AreaChart: Rc ? Rc.AreaChart : N, Area: Rc ? Rc.Area : N,
    BarChart:  Rc ? Rc.BarChart  : N, Bar:  Rc ? Rc.Bar  : N,
    LineChart: Rc ? Rc.LineChart : N, Line: Rc ? Rc.Line : N,
    PieChart:  Rc ? Rc.PieChart  : N, Pie:  Rc ? Rc.Pie  : N,
    Cell: Rc ? Rc.Cell : N, XAxis: Rc ? Rc.XAxis : N, YAxis: Rc ? Rc.YAxis : N,
    CartesianGrid: Rc ? Rc.CartesianGrid : N, Tooltip: Rc ? Rc.Tooltip : N,
    ResponsiveContainer: Rc ? Rc.ResponsiveContainer : N, Legend: Rc ? Rc.Legend : N,
  };
}

export default useRecharts;
