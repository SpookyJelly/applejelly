export type Item = {
  value: string;
  type: string;
  // NOTE: 이외의 타입들도 수용가능하도록 리터럴 타입 제거
  // | "port"
  // | "vehicle"
  // | "node"
  // | "charger"
  // | "mtl"
  // | "door"
  // | "created"
  // | "order";
  subType: string;
};

export const itemsSample: Item[] = [
  { value: "sta-port-12313", type: "port", subType: "" },
  { value: "sta-vehicle-11231", type: "vehicle", subType: "" },
  { value: "sta-node-1233", type: "node", subType: "" },
  { value: "sta-charger-3455", type: "charger", subType: "" },
  { value: "sta-mtl-21", type: "mtl", subType: "" },
  { value: "sta-mtl-22", type: "mtl", subType: "" },
];

export const multiItemsSample: Item[] = [
  { value: "sta-vehicle-1", type: "vehicle", subType: "AMS" },
  { value: "sta-vehicle-2", type: "vehicle", subType: "AMS" },
  { value: "sta-vehicle-3", type: "vehicle", subType: "OMS" },
  { value: "sta-port-1", type: "port", subType: "station" },
  { value: "sta-port-2", type: "port", subType: "station" },
  { value: "sta-port-3", type: "port", subType: "station" },
  { value: "sta-port-4", type: "port", subType: "station" },
  { value: "sta-port-5", type: "port", subType: "station" },
  { value: "sta-buffer-1", type: "port", subType: "buffer" },
  { value: "sta-buffer-2", type: "port", subType: "buffer" },
  { value: "sta-buffer-3", type: "port", subType: "buffer" },
  { value: "sta-buffer-4", type: "port", subType: "buffer" },
  { value: "sta-buffer-5", type: "port", subType: "buffer" },
  { value: "sta-buffer-6", type: "port", subType: "buffer" },
  { value: "sta-foo-1", type: "port", subType: "foo" },
  { value: "order-1", type: "order", subType: "" },
  { value: "sta-node-1", type: "node", subType: "" },
  { value: "sta-charger-1", type: "charger", subType: "" },
  { value: "sta-mtl-1", type: "mtl", subType: "" },
  { value: "sta-door-1", type: "door", subType: "exit" },
];
