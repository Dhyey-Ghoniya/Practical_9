const cacheService = require('../cache/cacheService');

// Simulated persistent database documents
let databaseTasks = [
  { id: 1, title: 'Learn React Component Architecture', completed: true, priority: 'High' },
  { id: 2, title: 'Configure React Router and State', completed: true, priority: 'Medium' },
  { id: 3, title: 'Integrate External REST API with useEffect', completed: true, priority: 'High' },
  { id: 4, title: 'Implement Express Backend with JWT Auth', completed: true, priority: 'Critical' },
  { id: 5, title: 'Apply Code Splitting and Lazy Loading', completed: true, priority: 'Medium' },
  { id: 6, title: 'Implement In-Memory Caching with node-cache', completed: false, priority: 'Critical' }
];

// Helper to simulate realistic database I/O latency (80-120ms)
const simulateDbQueryDelay = () => new Promise(resolve => setTimeout(resolve, 95));

// GET /api/tasks (With in-memory caching check)
exports.getTasks = async (req, res) => {
  const startTime = Date.now();
  const CACHE_KEY = 'all_tasks';

  // 1. Check in-memory cache
  const cached = cacheService.get(CACHE_KEY);
  if (cached.status === 'HIT') {
    const elapsed = Date.now() - startTime;
    return res.status(200).json({
      success: true,
      source: 'CACHE_HIT',
      responseTimeMs: elapsed,
      count: cached.data.length,
      tasks: cached.data
    });
  }

  // 2. Cache MISS: query database
  await simulateDbQueryDelay();
  const tasksFromDb = [...databaseTasks];

  // 3. Store into cache with 60s TTL
  cacheService.set(CACHE_KEY, tasksFromDb, 60);
  const elapsed = Date.now() - startTime;

  res.status(200).json({
    success: true,
    source: 'DATABASE_QUERY (CACHE_MISS)',
    responseTimeMs: elapsed,
    count: tasksFromDb.length,
    tasks: tasksFromDb
  });
};

// GET /api/tasks/uncached (Force uncached baseline measurement)
exports.getTasksUncached = async (req, res) => {
  const startTime = Date.now();
  await simulateDbQueryDelay();
  const elapsed = Date.now() - startTime;
  res.status(200).json({
    success: true,
    source: 'UNCACHED_BASELINE',
    responseTimeMs: elapsed,
    count: databaseTasks.length,
    tasks: databaseTasks
  });
};

// POST /api/tasks (Write operation -> MUST invalidate cache)
exports.createTask = async (req, res) => {
  const { title, priority = 'Medium' } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  await simulateDbQueryDelay();
  const newTask = {
    id: Date.now(),
    title,
    completed: false,
    priority
  };
  databaseTasks.push(newTask);

  // Invalidate cache immediately to prevent stale reads
  const deletedKeys = cacheService.del('all_tasks');
  console.log(`[Cache Invalidation] 'all_tasks' invalidated on POST write (cleared: ${deletedKeys})`);

  res.status(201).json({
    success: true,
    message: 'Task created and cache invalidated successfully',
    task: newTask
  });
};

// DELETE /api/tasks/:id (Write operation -> MUST invalidate cache)
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const initialLen = databaseTasks.length;
  databaseTasks = databaseTasks.filter(t => t.id !== parseInt(id) && t.id !== id);

  if (databaseTasks.length === initialLen) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  // Invalidate cache
  cacheService.del('all_tasks');
  console.log(`[Cache Invalidation] 'all_tasks' invalidated on DELETE write`);

  res.status(200).json({
    success: true,
    message: 'Task deleted and cache invalidated successfully'
  });
};

// GET /api/tasks/cache-stats (Inspect cache hit/miss ratio)
exports.getStats = (req, res) => {
  res.status(200).json({
    success: true,
    stats: cacheService.getStats()
  });
};