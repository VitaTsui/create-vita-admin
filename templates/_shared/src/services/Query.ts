import { isNull } from "lodash";

/**
 *@property EQ(" = ", "equal to"),
 *@property NE(" <> ", "not equal to"),
 *@property LK(" like ", "contains"),
 *@property LLK(" like ", "contains on the left"),
 *@property RLK(" like ", "contains on the right"),
 *@property NLK(" not like ", "does not contain"),
 *@property IN(" in ", "in .."),
 *@property NIN(" not in ", "not in .."),
 *@property LT(" < ", "less than"),
 *@property LE(" <= ", "less than or equal to"),
 *@property GT(" > ", "greater than"),
 *@property GE(" >= ", "greater than or equal to"),
 *@property BT(" between ", "between .. and .."),
 *@property IS(" is ", "is"),
 *@property NIS(" is not ", "is not"),
 *@property ASC(" asc ", "ascending"),
 *@property DESC(" desc ", "descending"),
 *@property AND("and", "and"),
 *@property OR("or", "or"),
 */
export type ModeType =
  | "EQ"
  | "NE"
  | "LK"
  | "LLK"
  | "RLK"
  | "NLK"
  | "IN"
  | "NIN"
  | "LT"
  | "LE"
  | "GT"
  | "GE"
  | "BT"
  | "IS"
  | "NIS"
  | "ASC"
  | "DESC"
  | "AND"
  | "OR"
  | string;

export type OrderType = "desc" | "asc";

export type RuleNameType = string;

export type LogicType = "and" | "or" | "not" | string;

/**
 * Filter condition
 * @property {sting} k query key
 * @property {unknown} v query value
 * @property {ModeType} m query mode, default (LK), optional
 * @property {LogicType} t1 logic between conditions, default (and), optional
 * @property {number} s sequence, default (0), optional
 * @property {RuleNameType} n rule name, default (a1), optional
 * @property {LogicType} t logic between rules, default (and), optional
 * @property {Omit<filterType, 'w' | "t1">[]} w filter conditions, default ([]), optional
 */
export interface filterType {
  k: string;
  v: unknown;
  m?: ModeType;
  t1?: LogicType;
  s?: number;
  n?: RuleNameType;
  t?: LogicType;
  w?: Omit<filterType, "w" | "t1">[];
}

export default class Query {
  get value() {
    return this.toEncode();
  }

  get valueObj() {
    return this.toQuery();
  }

  /**
   * w filter conditions
   *
   * @see {Query#r}
   * @deprecated
   */
  private _w: filterType[] = [];

  /**
   * r filter conditions
   */
  private _r: Partial<Omit<filterType, "t1">>[] = [];

  /**
   * o sorting
   */
  private _o: { k: string; t?: OrderType }[] = [];

  /**
   * j filter conditions after the ON of a left/right join, mainly for backend developers
   */
  private _j: filterType[] = [];

  /**
   * p pagination conditions
   */
  private _p: { n?: number; s?: number; c?: 1 | 0 } | undefined = {
    n: 1,
    s: 10,
  };

  /**
   * s filtered fields
   */
  private _s: { v?: string | string[] } = {};

  /**
   * Filter conditions
   * @param objKv form data
   * @param objKm query mode per field
   * @param objRn rule names
   * @returns
   */
  public toF = <T = Record<string, unknown>>(
    objKv: Partial<T>,
    objKm: { [K in keyof T]?: ModeType },
    objRn: { [K in keyof T]?: RuleNameType },
    objKt?: { [K in keyof T]?: LogicType }
  ) => {
    this._r = [];

    for (const key in objKv) {
      this.toR(
        key,
        objKv[key],
        objKm[key],
        objKt?.[key] || "and",
        0,
        objRn[key]
      );
    }
  };

  /**
   * Filter condition
   * @param {sting} k query key
   * @param {unknown} v query value
   * @param {ModeType} m query mode, default (LK), optional
   * @param {LogicType} t1 logic between conditions, default (and), optional
   * @param {number} s sequence, default (0), optional
   * @param {RuleNameType} n rule name, default (a1), optional
   * @param {LogicType} t logic between rules, default (and), optional
   * @param {boolean} w allow duplicate query keys, default (false), optional
   * @returns
   */
  public toR = (
    k: string,
    v: unknown,
    m: ModeType = "LK",
    t1: LogicType = "and",
    s: number = 0,
    n: RuleNameType = "a1",
    t: LogicType = "and",
    w: boolean = false
  ) => {
    const passType =
      typeof v !== "number" &&
      typeof v !== "bigint" &&
      typeof v !== "boolean" &&
      !isNull(v);

    if (
      (passType && !v) ||
      (m === "IN" && Array.isArray(v) && v.length === 0) ||
      !m
    ) {
      return;
    }

    const rObj = this._r.find((x) => x.n === n);
    if (rObj && (!rObj.w?.find((x) => x.k === k) || w)) {
      rObj.w?.push({
        k: k,
        v: v,
        m: m,
        t: t1,
        s: s,
      });
    } else {
      if (!this._r?.find((x) => x.n === n)) {
        this._r?.push({
          n: n,
          t: t,
          w: [
            {
              k: k,
              v: v,
              m: m,
              t: t1,
              s: s,
            },
          ],
        });
      }
    }
  };

  /**
   * Equals query
   * @param {sting} k query key
   * @param {unknown} v query value
   * @param {LogicType} t1 logic between conditions, default (and), optional
   * @param {number} s sequence, default (0), optional
   * @param {RuleNameType} n rule name, default (a1), optional
   * @param {LogicType} t logic between rules, default (and), optional
   */
  public toEqual = (
    k: string,
    v: unknown,
    t1: LogicType = "and",
    s: number = 0,
    n: RuleNameType = "a1",
    t: LogicType = "and"
  ) => {
    this._r = [];

    this.toR(k, v, "EQ", t1, s, n, t);
  };

  /**
   * Contains (like) query
   * @param {sting} k query key
   * @param {unknown} v query value
   * @param {LogicType} t1 logic between conditions, default (and), optional
   * @param {number} s sequence, default (0), optional
   * @param {RuleNameType} n rule name, default (a1), optional
   * @param {LogicType} t logic between rules, default (and), optional
   */
  public toLike = (
    k: string,
    v: unknown,
    t1: LogicType = "and",
    s: number = 0,
    n: RuleNameType = "a1",
    t: LogicType = "and"
  ) => {
    this._r = [];

    this.toR(k, v, "LK", t1, s, n, t);
  };

  /**
   * Sorting
   * @param {key} k sort field
   * @param {OrderType} t ascending or descending
   */
  public toO = (k: string, t: OrderType = "desc") => {
    this._o = [];

    if (typeof k === "undefined" || k === "") {
      return;
    }
    if (this._o.find((x) => x.k === k)) {
      this._o.find((x) => x.k === k)!.t = t;
    } else {
      this._o.push({
        k: k,
        t: t,
      });
    }
  };
  public toOArr = (o: { k: string; t: OrderType }[]) => {
    this._o = o;
  };

  /**
   * Pagination conditions
   * @param {number} n page number
   * @param {number} s page size
   * @param {1 | 0} c whether to query the total count, optional; if set to 1, the total count is not queried
   */
  public toP = (n: number, s: number, c: 1 | 0 = 0) => {
    this._p = {
      n: n,
      s: s,
      c: c,
    };
  };

  /**
   * Filtered fields
   * @param {string} v fields to filter; supports a String of multiple comma-separated fields, e.g. "username,mob", or an array, e.g. ["username", "mob"]
   */
  public toS = (v: string) => {
    this._s = {
      v: v,
    };
  };

  /**
   * query object
   */
  public toQuery = () => {
    return {
      w: this._w,
      r: this._r,
      o: this._o,
      j: this._j,
      p: this._p,
      s: this._s,
    };
  };

  /**
   * Convert the query object to a string
   */
  public toJsonStr = () => {
    return JSON.stringify({
      w: this._w,
      r: this._r,
      o: this._o,
      j: this._j,
      p: this._p,
      s: this._s,
    });
  };

  /**
   * URL-encode the query conditions
   */
  public toEncode = () => {
    return encodeURIComponent(this.toJsonStr());
  };

  /**
   * Clear the query conditions
   */
  public clear = () => {
    this._w = [];
    this._r = [];
    this._o = [];
    this._j = [];
    this._p = undefined;
    this._s = {};
  };
}
