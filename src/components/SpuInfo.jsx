import React, { useMemo, useCallback } from "react";
import { makeStyles } from "@material-ui/styles";

import ComImg from "./ComImg";

// api usage
// topList={[
//   {
//     key: 'title',
//     text: modalData.title,
//   },
// ]}
// bottomList={[
//   {
//     key: "spec",
//     text: modalData.spec,
//   },
// ]}
// mainPic={modalData.mainPic}

export default function SpuInfo({ topList, bottomList, mainPic, style }) {
  const classes = makeStyles(theme => {
    const flexBox = {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: 'center'
    };

    return {
      flexBox,
      root: {
        ...flexBox,
        height: 52,
      },
      colBox: {
        ...flexBox,
        // width: 200,
      },
      label: {
        width: 70,
        display: "inline-block",
      },
      picBox: {
        height: "100%",
      },
      infoBox: {
        height: "100%",
        marginLeft: 8,
        textAlign: "start",
        // overflow: 'hidden'
      },
      text: {
        width: 100,
        overflow: "hidden",
        // /*文本不会换行*/
        "white-space": "nowrap",
        // /*当文本溢出包含元素时，以省略号表示超出的文本*/
        "text-overflow": "ellipsis",
      },
      listBox: {
        ...flexBox,
        height: 26,
      },
      info: {
        overflow: "hidden",
        "white-space": "nowrap",
        "text-overflow": "ellipsis",
      },
    };
  })();

  const renderColBox = useCallback(
    item => {
      return (
        <div
          className={classes.colBox}
          key={item.key}
          children={
            item.key === "spec" || item.key === "title" ? (
              <div className={classes.text}>{item.text}</div>
            ) : (
              <>
                {item.label && <span className={classes.label}>{item.label}</span>}
                {item.info && (
                  <span style={{ width: item.key === "orderNo" ? 200 : 70 }} className={classes.info}>
                    {item.info}
                  </span>
                )}
              </>
            )
          }
        />
      );
    },
    [classes],
  );

  return (
    <div className={classes.root} style={style}>
      <div className={classes.picBox}>
        <ComImg src={mainPic} />
      </div>
      <div className={classes.infoBox}>
        <div className={classes.listBox}>{topList.map(item => renderColBox(item))}</div>
        <div className={classes.listBox}>{bottomList.map(item => renderColBox(item))}</div>
      </div>
    </div>
  );
}
