/**
 * 菜单状态管理（动态导航核心）
 * 菜单管理页的增删改 → 实时驱动 TabBar / 系统宫格 / 首页快捷入口
 */
import { useSyncExternalStore, useMemo } from 'react';
import { mockApi, type MenuConfig } from '../mock/menuConfig';

// ==================== 类型 ====================

interface MenuState {
  menus: MenuConfig[];
  loaded: boolean;
  loading: boolean;
}

// ==================== Store 实现 ====================

let state: MenuState = {
  menus: [],
  loaded: false,
  loading: false,
};

const listeners = new Set<() => void>();

function getSnapshot(): MenuState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((l) => l());
}

// ==================== 操作接口 ====================

export const menuStore = {
  getSnapshot,
  subscribe,

  /** 初始化加载菜单（只加载一次） */
  load: async () => {
    if (state.loading || state.loaded) return;
    state = { ...state, loading: true };
    try {
      const res = await mockApi.getMenuConfig();
      if (res.code === 0) {
        state = { menus: res.data, loaded: true, loading: false };
      }
    } finally {
      state.loading = false;
      emitChange();
    }
  },

  /** 获取 TabBar 项（/tabbar 的子节点，visible） */
  getTabMenus: (): MenuConfig[] => {
    const tabParent = state.menus.find((m) => m.path === '/tabbar');
    return (tabParent?.children || []).filter((m) => m.visible).sort((a, b) => a.sort - b.sort);
  },

  /** 获取某个父路径下的子菜单（visible） */
  getChildMenus: (parentPath: string): MenuConfig[] => {
    const parent = state.menus.find((m) => m.path === parentPath);
    return (parent?.children || []).filter((m) => m.visible).sort((a, b) => a.sort - b.sort);
  },

  /** 添加菜单 */
  add: (menu: Omit<MenuConfig, 'id'>) => {
    const maxId = Math.max(0, ...state.menus.map((m) => m.id), ...state.menus.flatMap((m) => (m.children || []).map((c) => c.id)));
    const newMenu: MenuConfig = { ...menu, id: maxId + 1 };
    if (newMenu.parentId === 0) {
      state = { ...state, menus: [...state.menus, newMenu] };
    } else {
      const addToParent = (items: MenuConfig[]): MenuConfig[] =>
        items.map((item) => {
          if (item.id === newMenu.parentId) {
            return { ...item, children: [...(item.children || []), newMenu] };
          }
          return item.children ? { ...item, children: addToParent(item.children) } : item;
        });
      state = { ...state, menus: addToParent(state.menus) };
    }
    emitChange();
  },

  /** 更新菜单 */
  update: (id: number, data: Partial<MenuConfig>) => {
    const updateRecursive = (items: MenuConfig[]): MenuConfig[] =>
      items.map((item) => {
        if (item.id === id) return { ...item, ...data };
        if (item.children) return { ...item, children: updateRecursive(item.children) };
        return item;
      });
    state = { ...state, menus: updateRecursive(state.menus) };
    emitChange();
  },

  /** 删除菜单 */
  remove: (id: number) => {
    const deleteRecursive = (items: MenuConfig[]): MenuConfig[] =>
      items.filter((item) => item.id !== id).map((item) => ({
        ...item,
        children: item.children ? deleteRecursive(item.children) : undefined,
      }));
    state = { ...state, menus: deleteRecursive(state.menus) };
    emitChange();
  },

  /** 切换可见性 */
  toggleVisible: (id: number) => {
    const toggleRecursive = (items: MenuConfig[]): MenuConfig[] =>
      items.map((item) => {
        if (item.id === id) return { ...item, visible: !item.visible };
        if (item.children) return { ...item, children: toggleRecursive(item.children) };
        return item;
      });
    state = { ...state, menus: toggleRecursive(state.menus) };
    emitChange();
  },
};

// ==================== Hooks ====================

/** 获取菜单原始状态（组件内用 useMemo 派生数据，避免 selector 返回新引用导致无限渲染） */
export function useMenuState(): MenuState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** 获取 TabBar 菜单 */
export function useTabMenus(): MenuConfig[] {
  const { menus } = useMenuState();
  return useMemo(() => {
    const tabParent = menus.find((m) => m.path === '/tabbar');
    return (tabParent?.children || []).filter((m) => m.visible).sort((a, b) => a.sort - b.sort);
  }, [menus]);
}

/** 获取某个父路径下的子菜单 */
export function useChildMenus(parentPath: string): MenuConfig[] {
  const { menus } = useMenuState();
  return useMemo(() => {
    const parent = menus.find((m) => m.path === parentPath);
    return (parent?.children || []).filter((m) => m.visible).sort((a, b) => a.sort - b.sort);
  }, [menus, parentPath]);
}

export type { MenuConfig };
