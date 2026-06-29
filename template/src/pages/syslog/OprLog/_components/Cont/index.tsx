import React from "react";
import styles from "./index.module.less";
import classNames from "classnames";

interface ContItem {
  fieldName: string;
  fieldDesc: string;
  oldValue: string;
  newValue: string;
}

interface ContProps {
  value?: string;
}

const Cont: React.FC<ContProps> = (props) => {
  const { value } = props;

  return (
    <div className={styles.Cont}>
      {!!JSON.parse(value || "[]")?.length && (
        <div className={styles.items}>
          <div className={classNames(styles.item, styles.header)}>
            <div className={styles.fieldName}>字段名称</div>
            <div className={styles.fieldDesc}>字段说明</div>
            <div className={styles.oldValue}>旧值</div>
            <div className={styles.newValue}>新值</div>
          </div>
          {JSON.parse(value || "[]")?.map((item: ContItem) => {
            return (
              <div className={styles.item}>
                <div className={styles.fieldName}>{item.fieldName}</div>
                <div className={styles.fieldDesc}>{item.fieldDesc}</div>
                <div className={styles.oldValue}>
                  {typeof item.oldValue === "string"
                    ? item.oldValue
                    : JSON.stringify(item.oldValue)}
                </div>
                <div className={styles.newValue}>
                  {typeof item.newValue === "string"
                    ? item.newValue
                    : JSON.stringify(item.newValue)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cont;
