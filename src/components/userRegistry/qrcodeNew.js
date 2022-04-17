//TODO: Figure out how to rerender this component when the transaction
// occurs. <QRCodeNew text={did}/>
// Right now this code is inclused in Insert.js

import QRCode from "qrcode";
import { useEffect, useState } from "react";

const QRCodeNew = ({ text }) => {
  const [src, setSrc] = useState("");

  useEffect(() => {
    QRCode.toDataURL(text).then((data) => {
      setSrc(data);
    });
  }, [text]);

  return (
    <div>
      <img src={src} />
    </div>
  );
};

export default QRCodeNew;
