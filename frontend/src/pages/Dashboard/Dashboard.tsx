import React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  // Sample data for charts
  const leadGenerationData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Leads Generated',
        data: [120, 190, 230, 250, 220, 320],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const emailMetricsData = {
    labels: ['Delivered', 'Opened', 'Clicked', 'Replied'],
    datasets: [
      {
        data: [65, 45, 20, 10],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Sample stats
  const stats = [
    {
      name: 'Total Leads',
      value: '12,487',
      change: '+12%',
      increasing: true,
      icon: UserGroupIcon,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      name: 'Email Open Rate',
      value: '58.3%',
      change: '+4.3%',
      increasing: true,
      icon: EnvelopeIcon,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      name: 'Verified Emails',
      value: '9,342',
      change: '+8.6%',
      increasing: true,
      icon: CheckCircleIcon,
      color: 'bg-green-100 text-green-800',
    },
    {
      name: 'Bounce Rate',
      value: '2.4%',
      change: '-0.5%',
      increasing: false,
      icon: ExclamationCircleIcon,
      color: 'bg-orange-100 text-orange-800',
    },
  ];

  // Sample recent enrichment tasks
  const recentTasks = [
    {
      id: 1,
      name: 'Tech Startups in SF',
      status: 'Completed',
      leads: 245,
      date: '2 hours ago',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      id: 2,
      name: 'Marketing Directors in NYC',
      status: 'Processing',
      leads: 112,
      date: '3 hours ago',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 3,
      name: 'Healthcare CTOs',
      status: 'Pending',
      leads: 0,
      date: '5 hours ago',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
    {
      id: 4,
      name: 'E-commerce Managers in Europe',
      status: 'Failed',
      leads: 0,
      date: '1 day ago',
      statusColor: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your lead generation and email campaign metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <div className="font-medium text-primary-700 inline-flex items-center">
                  {stat.increasing ? (
                    <ArrowUpIcon
                      className="mr-1 h-4 w-4 flex-shrink-0 self-center text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <ArrowDownIcon
                      className="mr-1 h-4 w-4 flex-shrink-0 self-center text-red-500"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={
                      stat.increasing ? 'text-green-600' : 'text-red-600'
                    }
                  >
                    {stat.change}
                  </span>{' '}
                  <span className="text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Lead Generation
            </h3>
            <div className="mt-2 h-64">
              <Line 
                data={leadGenerationData} 
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Email Metrics
            </h3>
            <div className="mt-2 h-64 flex justify-center">
              <div style={{ width: '70%' }}>
                <Doughnut 
                  data={emailMetricsData} 
                  options={{ 
                    maintainAspectRatio: false,
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrichment Tasks */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Enrichment Tasks
          </h3>
          <div className="text-sm">
            <a
              href="#"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              View all
            </a>
          </div>
        </div>
        <div className="mt-3 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentTasks.map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {task.name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.statusColor}`}
                        >
                          {task.status}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 text-sm text-gray-500">
                        {task.leads} leads
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex"></div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>{task.date}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;