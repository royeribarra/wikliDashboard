import React from "react";
import { Spin } from 'antd';

function Loader()
{

  return(
    <Spin className="spin__center" tip="Espere..." spinning={true}></Spin>
  );
}

export default Loader;