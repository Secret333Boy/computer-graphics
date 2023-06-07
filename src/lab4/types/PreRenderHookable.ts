export interface PreRenderHookable {
  // hook that implementors may use to initialize some structures right before render (like acceleration structures);
  // it is useful to have, because some traceable groups might want to initialize acceleration structures right before render
  //, e.g., not in a constructor,
  // because there might be a lot of transforms between group initialization and render
  onPreRender?: () => void;
}
