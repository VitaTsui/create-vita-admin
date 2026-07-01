import React from "react";
import { useNavigate } from "react-router-dom";

import { Icon, Chart, Panel } from "@hsu-react/ui";
import { getUserInfo } from "@/utils/auth";
import { adminPath } from "@/router/router.config";
import styles from "./index.module.scss";

/**
 * 概览 / 仪表盘（脚手架默认落地页）
 *
 * 这是一个不依赖任何后端业务接口的静态示例页，用于演示框架的卡片、图表与
 * 快捷入口布局。接入真实项目时，把下面的静态数据替换为接口数据即可。
 */

type Stat = {
  key: string;
  label: string;
  value: string | number;
  icon: string;
  color: string;
  to?: string;
};

const STATS: Stat[] = [
  {
    key: "user",
    label: "用户数",
    value: 128,
    icon: "ph:users-three-bold",
    color: "#1677ff",
    to: adminPath("permit/user/index"),
  },
  {
    key: "role",
    label: "角色数",
    value: 12,
    icon: "carbon:user-role",
    color: "#52c41a",
    to: adminPath("permit/role/index"),
  },
  {
    key: "menu",
    label: "菜单数",
    value: 36,
    icon: "ph:tree-structure-bold",
    color: "#722ed1",
    to: adminPath("permit/menu/index"),
  },
  {
    key: "log",
    label: "今日访问日志",
    value: 1024,
    icon: "carbon:document-multiple-01",
    color: "#fa8c16",
    to: adminPath("syslog/ApiLog/index"),
  },
];

const SHORTCUTS: { label: string; icon: string; to: string }[] = [
  { label: "用户管理", icon: "ph:user-bold", to: adminPath("permit/user/index") },
  { label: "角色管理", icon: "carbon:user-role", to: adminPath("permit/role/index") },
  { label: "字典管理", icon: "carbon:catalog", to: adminPath("sysmgmt/Dict/index") },
  { label: "接口日志", icon: "carbon:cloud-logging", to: adminPath("syslog/ApiLog/index") },
];

const VISIT_X = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const VISIT_Y = [820, 932, 901, 934, 1290, 1330, 1320];

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { nickname } = getUserInfo();

  return (
    <Panel.Default contentClassName={styles.overviewContent}>
      <div className={styles.overview}>
        <div className={styles.banner}>
        <div>
          <div className={styles.hello}>
            你好{nickname ? `，${nickname}` : ""} 👋
          </div>
          <div className={styles.sub}>
            欢迎使用后台管理脚手架，祝你开发顺利。
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        {STATS.map((s) => (
          <div
            key={s.key}
            className={styles.statCard}
            onClick={() => s.to && navigate(s.to)}
          >
            <div
              className={styles.statIcon}
              style={{ color: s.color, background: `${s.color}1a` }}
            >
              <Icon icon={s.icon} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelTitle}>近 7 日访问趋势</div>
          <Chart.Line
            className={styles.chart}
            xAxisData={VISIT_X}
            seriesData={VISIT_Y}
            legendData={["访问量"]}
          />
        </div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>快捷入口</div>
          <div className={styles.shortcuts}>
            {SHORTCUTS.map((sc) => (
              <div
                key={sc.to}
                className={styles.shortcut}
                onClick={() => navigate(sc.to)}
              >
                <Icon className={styles.shortcutIcon} icon={sc.icon} />
                <span className={styles.shortcutLabel}>{sc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </Panel.Default>
  );
};

export default Overview;
