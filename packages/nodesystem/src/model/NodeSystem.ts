import { debounceDecorator, EventEmitter } from '@plantarium/helpers';
import DefaultNodes from '../nodes';
import NodeSystemView from '../view/NodeSystemView';
import Logger from './Logger';
import type Node from './Node';
import NodeFactory from './NodeFactory';
import NodeHistory from './NodeHistory';
import NodeParser from './NodeParser';
import type NodeType from './NodeType';
import NodeTypeStore from './NodeTypeStore';

/**
 * @ignore
 */
let systemID = 0;

interface NodeSystemOptions {
  view?: boolean;
  wrapper?: HTMLElement;
  defaultNodes?: string[] | boolean;
  registerNodes?: NodeTypeData[];
  logLevel?: number;
  parent?: HTMLElement;
}

export default class NodeSystem extends EventEmitter {
  private parser: NodeParser = new NodeParser(this);
  meta: NodeSystemMeta = { lastSaved: Date.now() };

  outputNode!: Node;
  factory: NodeFactory;
  store: NodeTypeStore;
  log: Logger;
  history: NodeHistory;

  isLoaded = false;
  isPaused = false;

  nodes: Node[] = [];
  _result: unknown;

  states: NodeSystemData[] = [];

  id: number = systemID++;

  view!: NodeSystemView;
  options: NodeSystemOptions;

  constructor(options: NodeSystemOptions = {}) {
    super();
    const {
      view = false,
      wrapper,
      defaultNodes = false,
      registerNodes = false,
      logLevel = 5,
    } = options;
    this.options = { view, wrapper };

    try {
      this.log = new Logger(this, logLevel);
      this.log.group(`Instantiated id:${this.id}`);
      this.store = new NodeTypeStore();
      this.factory = new NodeFactory(this);
      this.history = new NodeHistory(this);

      if (view) {
        this.view = new NodeSystemView(this);
      }

      if (defaultNodes) {
        const nodesToRegister: (NodeType | NodeTypeData)[] = [];

        if (defaultNodes === true) {
          nodesToRegister.push(
            ...Object.entries(DefaultNodes).map((entry) => entry[1]),
          );
        } else if (Array.isArray(defaultNodes) && defaultNodes.length) {
          defaultNodes.forEach((type) => {
            if (typeof type === 'string' && type in DefaultNodes) {
              nodesToRegister.push(DefaultNodes[type]);
            }
          });
        }

        nodesToRegister.forEach((nodeType) => this.registerNodeType(nodeType));
      }

      if (registerNodes && registerNodes.length) {
        registerNodes.forEach(this.registerNodeType.bind(this));
      }

      this.log.groupEnd();
    } catch (error) {
      this.emit('error', { type: 'init', error });
    }
  }

  get result() {
    return this._result;
  }

  set result(res) {
    this._result = res;
    if (this.isLoaded) this.emit('result', res);
  }

  setMetaData(data: Partial<NodeSystemMeta>) {
    this.meta = { ...this.meta, ...data };
    this.save();
  }

  load(systemData: NodeSystemData) {
    try {
      this.isLoaded = false;
      this.isPaused = true;
      this.nodes.forEach((n) => (n.enableUpdates = false));
      this.nodes.forEach((n) => n.remove());
      this.factory.reset();
      const nodes = this.parser.parseSystem(systemData);
      this.addNodes(nodes);
      this.meta = systemData.meta || { lastSaved: 0 };
      this.meta.lastSaved = Date.now();
      this?.view?.setTransform(this.meta.transform);

      this.log.info(
        `Loaded NodeSystemData with ${nodes.length} Nodes`,
        systemData,
      );

      if ('history' in systemData) {
        this.history.deserialize(systemData.history);
      }

      this.isPaused = false;
      this.isLoaded = true;

      this.result = this._result;

      return this;
    } catch (error) {
      this.emit('error', { type: 'loading', error });
    }
  }

  serialize() {
    return {
      ...this.parser.getData(),
      history: this.history.serialize(),
      meta: this.meta,
    };
  }

  @debounceDecorator(1000)
  save() {
    if (this.isLoaded) {
      this.meta.lastSaved = Date.now();
      this.log.info('save system', this.serialize());
      this.emit('save', this.serialize());
    }
  }

  setOutputNode(node: Node) {
    if (this.outputNode) {
      this.outputNode.remove();
    }
    this.outputNode = node;
    node.on('computedData', (data) => (this.result = data));
  }

  addNodes(nodes: Node[]) {
    nodes.forEach((n) => this.addNode(n));
  }

  addNode(node: Node) {
    this.history.addAction();
    this.nodes.push(node);
    this.save();
  }

  removeNode(node: Node) {
    this.history.addAction();

    node.enableUpdates = false;

    node.view.remove();

    Object.values(node.states).forEach((i) => i.remove());

    node.outputs.forEach((o) => o.remove());
    node.getInputs().forEach((i) => i.remove());

    this.nodes = this.nodes.filter((n) => n !== node);

    this.save();

    this.log.info(
      `Removed Node id:${node.id} type:${node.attributes.type}`,
      node.deserialize(),
    );
  }

  spliceNode(node: Node) {
    const leftSockets = node.getInputs().map((i) => i?.connection?.output);
    const rightSockets = node.outputs
      .map((o) => o.connections)
      .flat()
      .map((c) => c.input);

    for (let i = 0; i < leftSockets.length; i++) {
      const leftSocket = leftSockets[i];
      const rightSocket = rightSockets[i];
      if (!rightSocket || !leftSocket) continue;
      leftSocket.connectTo(rightSocket);
    }

    return this.removeNode(node);
  }

  getSockets(type?: string) {
    const sockets = this.nodes.map((n) => [...n.getSockets()]).flat();
    if (!type) return sockets;
    return sockets.filter((s) => s.type === type);
  }

  getInputs(type?: string) {
    const inputs = this.nodes.map((n) => n.getInputs()).flat();
    if (!type || type === '*') return inputs;
    return inputs.filter((s) => s.type.includes('*') || s.type.includes(type));
  }

  getOutputs(type?: string[]) {
    const outputs = this.nodes.map((n) => n.outputs).flat();
    if (!type || type.includes('*')) return outputs;
    return outputs.filter((s) => s.type === '*' || type.includes(s.type));
  }

  createNode(props: NodeProps) {
    const node = this.factory.create(props);
    this.addNode(node);
    this.save();
    this.log.info(
      `Created new node id:${props.attributes.id} type:${props.attributes.type}`,
      props,
    );
    return node;
  }

  getNodes() {
    return this.nodes;
  }

  findNodeById(id: string) {
    return this.nodes.filter((node) => node.id === id)[0];
  }

  getNodeTypes(): NodeType[] {
    return this.store.types;
  }

  registerNodeType(type: NodeType | NodeTypeData) {
    if ('node' in type) {
      this.store.add(type);
    } else {
      const _type = this.parser.parseType(type);
      this.store.add(_type);
    }

    this.log.info(`Registered new nodeType type:${type.title}`, type);
  }
}
