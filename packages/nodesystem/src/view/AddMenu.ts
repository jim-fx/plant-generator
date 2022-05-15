import './AddMenu.css';
import type NodeSystemView from './NodeSystemView';
import type NodeInput from '../model/NodeInput';
import type NodeOutput from '../model/NodeOutput';
import type NodeType from '../model/NodeType';
import type NodeSystem from '../model/NodeSystem';
import { InputSearch } from '@plantarium/ui';
import type { NodeProps } from '../types';

interface ContextOptions {
  x: number;
  y: number;
  socket?: NodeInput | NodeOutput;
}

export default class RightClickMenu {
  wrapper: HTMLDivElement;

  searchEl: InputSearch;

  view: NodeSystemView;
  system: NodeSystem;

  x = 0;
  y = 0;

  socket: NodeInput | NodeOutput | undefined;
  types: NodeType[];

  res!: (data: NodeProps) => void;
  rej!: () => void;

  constructor(view: NodeSystemView) {
    this.view = view;
    this.system = view.system;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('context-wrapper');
    this.searchEl = new InputSearch({ target: this.wrapper });

    this.searchEl.$on('input', ({ detail: value }) => {
      this.resolve(value);
    });

    this.view.wrapper.append(this.wrapper);

    this.view.system.store.on(
      'types',
      (types: NodeType[]) => this.updateTypes(types),
      20,
    );

    this.wrapper.classList.add('cl-' + Math.floor(Math.random() * 1000));

    this.view.on('keydown', ({ key }) => key === 'Escape' && this.hide());
  }

  updateTypes(types: NodeType[]) {
    this.searchEl.setItems(
      types.map((t) => {
        return {
          value: t.type || t.title,
          title: t.title,
        };
      }),
    );
  }

  handleWindowClick(ev: MouseEvent) {
    const path = ev.composedPath();
    if (!path.includes(this.wrapper)) {
      this.reject();
    }
  }

  private reject() {
    if (this.rej) this.rej();
    this.hide();
  }

  private resolve(typeName: string) {
    const type = this.system.store.getByName(typeName);

    const { x: rx, y: ry } = this.view.projectWindowToLocal(this.x, this.y);

    const x = rx - this.view.width / 2;
    const y = ry - this.view.height / 2;

    if (type) {
      this.res({
        attributes: {
          pos: {
            x,
            y,
          },
          id: '',
          name: type.title,
          type: type.title,
          refs: [],
        },
        state: {
          value: undefined,
        },
      });
    } else {
      this.reject();
    }

    this.hide();
  }

  hide() {
    this.searchEl.clear();
    this.wrapper.classList.remove('context-visible');
    this.wrapper.blur();
    this.res = (d: NodeProps) => d;
    this.reject = () => {
      return;
    };
  }

  show({ x, y, socket }: ContextOptions): Promise<NodeProps> {
    this.x = x;
    this.y = y;
    this.socket = socket;

    this.wrapper.style.left = (x / this.system.view.width) * 100 + '%';
    this.wrapper.style.top = (y / this.system.view.height) * 100 + '%';
    this.wrapper.classList.add('context-visible');

    setTimeout(() => {
      this.searchEl.focus();
    }, 20);

    return new Promise((res, rej) => {
      this.res = res;
      this.rej = rej;
    });
  }
}
