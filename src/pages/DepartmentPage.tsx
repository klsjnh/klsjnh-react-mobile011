/**
 * 组织管理页 - 移动端（支持多集团 → 多分公司 → 多部门）
 */
import React, { useState } from 'react';
import { PageHeader, ConfirmDialog } from '../components';

interface DepartmentPageProps {
  onBack?: () => void;
  onNavigate?: (path: string) => void;
}

interface Organization {
  id: number;
  name: string;
  code: string;
  type: 'group' | 'company' | 'department' | 'team';
  leader: string;
  memberCount: number;
  description: string;
  children?: Organization[];
}

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  group: { label: '集团', icon: '🏛', color: '#f5222d' },
  company: { label: '分公司', icon: '🏢', color: '#1890ff' },
  department: { label: '部门', icon: '📋', color: '#52c41a' },
  team: { label: '团队', icon: '👥', color: '#faad14' },
};

export const DepartmentPage: React.FC<DepartmentPageProps> = ({ onBack, onNavigate }) => {
  void onNavigate;
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: 1, name: '华信集团', code: 'HX', type: 'group', leader: '王董事长', memberCount: 580, description: '集团总部',
      children: [
        {
          id: 11, name: '华信科技', code: 'HX-TECH', type: 'company', leader: '张总', memberCount: 280, description: '科技板块',
          children: [
            { id: 111, name: '研发中心', code: 'HX-TECH-RD', type: 'department', leader: '李总监', memberCount: 120, description: '产品研发' },
            { id: 112, name: '运营部', code: 'HX-TECH-OPS', type: 'department', leader: '王经理', memberCount: 80, description: '业务运营' },
            { id: 113, name: '市场部', code: 'HX-TECH-MKT', type: 'department', leader: '赵经理', memberCount: 50, description: '市场推广' },
            { id: 114, name: '财务部', code: 'HX-TECH-FIN', type: 'department', leader: '陈经理', memberCount: 30, description: '财务管理' },
          ],
        },
        {
          id: 12, name: '华信金融', code: 'HX-FIN', type: 'company', leader: '刘总', memberCount: 180, description: '金融板块',
          children: [
            { id: 121, name: '风控部', code: 'HX-FIN-RISK', type: 'department', leader: '周总监', memberCount: 60, description: '风险控制' },
            { id: 122, name: '投资部', code: 'HX-FIN-INV', type: 'department', leader: '吴经理', memberCount: 70, description: '投资业务' },
            { id: 123, name: '客服部', code: 'HX-FIN-CS', type: 'department', leader: '郑经理', memberCount: 50, description: '客户服务' },
          ],
        },
        {
          id: 13, name: '华信教育', code: 'HX-EDU', type: 'company', leader: '孙总', memberCount: 120, description: '教育板块',
          children: [
            { id: 131, name: '教研部', code: 'HX-EDU-EDU', type: 'department', leader: '钱总监', memberCount: 80, description: '课程研发' },
            { id: 132, name: '招生部', code: 'HX-EDU-REC', type: 'department', leader: '冯经理', memberCount: 40, description: '招生运营' },
          ],
        },
      ],
    },
    {
      id: 2, name: '鼎盛集团', code: 'DS', type: 'group', leader: '马董事长', memberCount: 320, description: '鼎盛集团总部',
      children: [
        {
          id: 21, name: '鼎盛地产', code: 'DS-RE', type: 'company', leader: '朱总', memberCount: 200, description: '地产板块',
          children: [
            { id: 211, name: '工程部', code: 'DS-RE-ENG', type: 'department', leader: '秦总监', memberCount: 100, description: '工程建设' },
            { id: 212, name: '销售部', code: 'DS-RE-SAL', type: 'department', leader: '尤经理', memberCount: 60, description: '房产销售' },
            { id: 213, name: '物业部', code: 'DS-RE-PRO', type: 'department', leader: '许经理', memberCount: 40, description: '物业管理' },
          ],
        },
        {
          id: 22, name: '鼎盛物业', code: 'DS-PRO', type: 'company', leader: '何总', memberCount: 120, description: '物业板块',
          children: [
            { id: 221, name: '安保部', code: 'DS-PRO-SEC', type: 'department', leader: '吕经理', memberCount: 70, description: '安全保卫' },
            { id: 222, name: '保洁部', code: 'DS-PRO-CLE', type: 'department', leader: '施经理', memberCount: 50, description: '清洁维护' },
          ],
        },
      ],
    },
  ]);

  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [dialog, setDialog] = useState({ visible: false });
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = (parentOrg?: Organization) => {
    const newOrg: Organization = {
      id: Date.now(),
      name: '新建' + (parentOrg ? typeLabels[parentOrg.type === 'group' ? 'company' : 'department']?.label || '组织' : '集团'),
      code: 'NEW',
      type: parentOrg?.type === 'group' ? 'company' : parentOrg?.type === 'company' ? 'department' : 'team',
      leader: '待定',
      memberCount: 0,
      description: '新创建的组织',
    };

    if (parentOrg) {
      const addToParent = (items: Organization[]): Organization[] =>
        items.map(item => {
          if (item.id === parentOrg.id) {
            return { ...item, children: [...(item.children || []), newOrg] };
          }
          return item.children ? { ...item, children: addToParent(item.children) } : item;
        });
      setOrganizations(addToParent(organizations));
    } else {
      setOrganizations(prev => [...prev, { ...newOrg, type: 'group' }]);
    }
    // 自动展开父级
    if (parentOrg) {
      setExpandedIds(prev => new Set([...prev, parentOrg.id]));
    }
  };

  const handleDelete = (org: Organization) => {
    setSelectedOrg(org);
    setDialog({ visible: true });
  };

  const confirmDelete = () => {
    if (selectedOrg) {
      const deleteRecursive = (items: Organization[]): Organization[] =>
        items.filter(item => item.id !== selectedOrg.id).map(item => ({
          ...item,
          children: item.children ? deleteRecursive(item.children) : undefined,
        }));
      setOrganizations(deleteRecursive(organizations));
    }
    setDialog({ visible: false });
    setSelectedOrg(null);
  };

  // 统计数据
  const stats = organizations.reduce(
    (acc, group) => {
      acc.groups++;
      acc.totalMembers += group.memberCount;
      if (group.children) {
        group.children.forEach(company => {
          acc.companies++;
          acc.totalMembers += company.memberCount;
          if (company.children) {
            company.children.forEach(dept => {
              acc.departments++;
              acc.totalMembers += dept.memberCount;
            });
          }
        });
      }
      return acc;
    },
    { groups: 0, companies: 0, departments: 0, totalMembers: 0 }
  );

  const renderOrg = (org: Organization, depth = 0): React.ReactNode => {
    const hasChildren = org.children && org.children.length > 0;
    const isExpanded = expandedIds.has(org.id);
    const typeInfo = typeLabels[org.type];

    return (
      <React.Fragment key={org.id}>
        <div
          style={{
            padding: '12px 14px', paddingLeft: `${14 + depth * 14}px`,
            background: depth === 0 ? 'var(--bg-card)' : depth === 1 ? '#fafafa' : '#fff',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(org.id)}
                style={{
                  background: 'none', border: 'none', fontSize: '10px', cursor: 'pointer',
                  padding: '0 4px', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              >
                ▶
              </button>
            ) : (
              <span style={{ width: '18px' }} />
            )}
            <span style={{ fontSize: '16px' }}>{typeInfo.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: depth <= 1 ? 600 : 400 }}>{org.name}</span>
                <span style={{
                  fontSize: '10px', padding: '1px 6px', borderRadius: '4px',
                  background: typeInfo.color + '20', color: typeInfo.color,
                }}>
                  {typeInfo.label}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {org.code} · {org.leader} · {org.memberCount} 人
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {org.type !== 'team' && (
                <button
                  onClick={() => handleAdd(org)}
                  style={{
                    width: '28px', height: '28px',
                    background: '#f6ffed', color: '#52c41a',
                    border: '1px solid #b7eb8f', borderRadius: '50%',
                    fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  +
                </button>
              )}
              <button
                onClick={() => handleDelete(org)}
                style={{
                  width: '28px', height: '28px',
                  background: '#fff1f0', color: '#f5222d',
                  border: '1px solid #ffccc7', borderRadius: '50%',
                  fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>
          </div>
        </div>
        {hasChildren && isExpanded && org.children!.map(child => renderOrg(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="page">
      <PageHeader
        title="组织管理"
        subtitle={`${stats.groups} 集团 · ${stats.companies} 分公司 · ${stats.departments} 部门`}
        onBack={onBack}
        right={
          <button
            onClick={() => handleAdd()}
            style={{
              height: '32px', padding: '0 14px',
              background: 'var(--primary)', color: '#fff',
              border: 'none', borderRadius: 'var(--radius)',
              fontSize: '13px', cursor: 'pointer',
            }}
          >
            + 新建
          </button>
        }
      />

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#f5222d' }}>{stats.groups}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>集团</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#1890ff' }}>{stats.companies}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>分公司</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#52c41a' }}>{stats.departments}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>部门</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 'var(--radius)', padding: '10px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, color: '#faad14' }}>{(stats.totalMembers / 1000).toFixed(1)}k</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>总人数</div>
        </div>
      </div>

      {/* 组织架构树 */}
      <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        {organizations.map(org => renderOrg(org))}
      </div>

      {/* 图例 */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
        {Object.entries(typeLabels).map(([key, info]) => (
          <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: info.color, display: 'inline-block' }} />
            {info.icon} {info.label}
          </span>
        ))}
      </div>

      <ConfirmDialog
        visible={dialog.visible}
        title="删除组织"
        content={`确定删除「${selectedOrg?.name}」吗？${selectedOrg?.children?.length ? '下属组织也会被删除。' : ''}`}
        onConfirm={confirmDelete}
        onCancel={() => setDialog({ visible: false })}
        danger
      />
    </div>
  );
};
