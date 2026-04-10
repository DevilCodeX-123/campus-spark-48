import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Budget } from '@/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

const BudgetManager: React.FC<{ budget: Budget; eventTitle: string }> = ({ budget, eventTitle }) => {
  const pieData = budget.allocations.map(a => ({
    name: a.category.charAt(0).toUpperCase() + a.category.slice(1),
    value: a.allocated,
  }));

  const barData = budget.allocations.map(a => ({
    name: a.category.charAt(0).toUpperCase() + a.category.slice(1),
    allocated: a.allocated,
    spent: a.spent,
  }));

  const totalSpent = budget.allocations.reduce((sum, a) => sum + a.spent, 0);
  const remaining = budget.totalBudget - totalSpent;
  const pct = (totalSpent / budget.totalBudget) * 100;

  return (
    <div className="dashboard-section space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-foreground">Budget: {eventTitle}</h3>
        <span className="font-heading text-xl font-bold text-foreground">₹{budget.totalBudget.toLocaleString()}</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct > 80 ? 'bg-destructive' : pct > 50 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className={`text-sm font-medium ${pct > 80 ? 'text-destructive' : pct > 50 ? 'text-warning' : 'text-success'}`}>
          ₹{remaining.toLocaleString()} remaining
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-4 text-sm font-medium text-muted-foreground">Allocation Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-medium text-muted-foreground">Budget vs Spent</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="#10b981" name="Spent" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
