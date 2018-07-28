import { KEYCODES } from 'libs/constants';
import * as storage from 'libs/storage';
import { getStream } from 'libs/hoc';
/*
  all navigation action define here
*/
export const handlers = {
  gotoParent: (activation$) => () => {
    const activation = activation$.get();
    const parentIm = storage.getParent(activation);
    if (parentIm) {
      activation$.set(parentIm);  
    }
  },
  gotoChildren: (activation$) => () => {
    const activation = activation$.get()
    const childIm = storage.getChild(activation);
    if (childIm) {
      activation$.set(childIm);
    }
  },
  gotoPrevSibling: (activation$) => () => {
    const activation = activation$.get()
    const siblings = storage.getSiblings(activation, -1);
    if (siblings && siblings[0]) {
      activation$.set(siblings[0]);
    }
  },
  gotoNextSibling: (activation$) => () => {
    const activation = activation$.get()
    const siblings = storage.getSiblings(activation, 1);
    if (siblings && siblings[0]) {
      activation$.set(siblings[0]);
    }
  },
};

const SHORTCODES = {
  gotoParent: {
    altKey: true,
    keyCode: KEYCODES.UP_ARROW,
  },
  gotoChildren: {
    altKey: true,
    keyCode: KEYCODES.DOWN_ARROW,
  },
  gotoPrevSibling: {
    altKey: true,
    keyCode: KEYCODES.LEFT_ARROW,
  },
  gotoNextSibling: {
    altKey: true,
    keyCode: KEYCODES.RIGHT_ARROW,
  },
};

const matching = (event) => {
  // const { altKey, charCode, ctrlKey, keyCode, shiftKey } = event;
  let res = [];
  Object.keys(SHORTCODES).map((handler) => {
    const rule = SHORTCODES[handler];
    const conds = Object.keys(rule);
    let isMatched = conds.length ? true : false;
    conds.map(cond => {
      if (event[cond] !== rule[cond]) {
        isMatched = false;
      }
    });
    if (isMatched) {
      res.push(handler);
    }
  });
  return res;
};

export const CTRL_KEY_STATE = 'navigator.ctrlKey.state';

export class Navigator {
  constructor(activation$) {
    this.activation$ = activation$;
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
  }

  onKeyDown = (event) => {
    const { altKey, charCode, ctrlKey, keyCode, shiftKey } = event;
    if(altKey) {
      getStream(CTRL_KEY_STATE).set(altKey);
    }

    const shortcodes = matching(event);
    shortcodes.map(handlerName => {
      if (typeof handlers[handlerName] === 'function') {
        handlers[handlerName](this.activation$)(event);
      }
    })
  }

  onKeyUp = (event) => {
    const { altKey, charCode, ctrlKey, keyCode, shiftKey } = event;
    if ([KEYCODES.ALT, KEYCODES.CTRL].indexOf(keyCode) >= 0) {
      getStream(CTRL_KEY_STATE).set(false);
    }
  }

}

