import { reactive } from 'vue'

export const store = reactive({
  currentUser: null,
  notifications: [],

  books: [
    {
      id: 1, title: 'Introduction to Computer Science', author: 'John Smith',
      isbn: '978-0-123456-47-2', category: 'Computer Science',
      status: 'borrowed', description: 'A comprehensive introduction to computer science fundamentals covering programming, algorithms, and computational thinking.',
      borrowedBy: 'JM', dueDate: '2025-12-20'
    },
    {
      id: 2, title: 'Data Structures and Algorithms', author: 'Jane Doe',
      isbn: '978-0-123456-48-9', category: 'Computer Science',
      status: 'overdue', description: 'An in-depth exploration of data structures and algorithmic problem solving.',
      borrowedBy: 'JM', dueDate: '2025-12-05', fine: 5.00
    },
    {
      id: 3, title: 'Modern Web Development', author: 'Robert Johnson',
      isbn: '978-0-123456-49-6', category: 'Web Development',
      status: 'available', description: 'A practical guide to modern web development using the latest technologies and frameworks.',
    },
    {
      id: 4, title: 'Principles of Economics', author: 'Sarah Williams',
      isbn: '978-0-123456-50-2', category: 'Economics',
      status: 'available', description: 'An introduction to microeconomics and macroeconomics principles for university students.',
    },
    {
      id: 5, title: 'Database Management Systems', author: 'Michael Brown',
      isbn: '978-0-123456-51-9', category: 'Computer Science',
      status: 'reserved', description: 'Comprehensive coverage of database concepts, SQL, and database design principles.',
    },
    {
      id: 6, title: 'Business Statistics', author: 'Emily Davis',
      isbn: '978-0-123456-52-6', category: 'Business',
      status: 'available', description: 'Statistical methods for business decision-making and data analysis.',
    },
    {
      id: 7, title: 'Digital Marketing Fundamentals', author: 'Chris Lee',
      isbn: '978-0-123456-53-3', category: 'Business',
      status: 'available', description: 'A comprehensive guide to digital marketing strategies, SEO, and social media.',
    },
    {
      id: 8, title: 'Linear Algebra for Engineers', author: 'Patricia Moore',
      isbn: '978-0-123456-54-0', category: 'Mathematics',
      status: 'borrowed', description: 'Essential linear algebra concepts applied to engineering problems.',
      borrowedBy: 'other'
    },
  ],

  reservations: [],
  loans: [],

  login(email, password) {
    if (password.length < 4) return false
    const isLibrarian = email.includes('librarian@')
    this.currentUser = {
      name: isLibrarian ? 'Dr. Abena Asante' : 'John Mensah',
      email,
      initials: isLibrarian ? 'AA' : 'JM',
      role: isLibrarian ? 'librarian' : 'student',
      studentId: 'LUG/2023/1234'
    }
    return true
  },

  logout() { this.currentUser = null },

  getUserLoans() {
    return this.books.filter(b => b.borrowedBy === 'JM')
  },

  borrowBook(bookId) {
    const book = this.books.find(b => b.id === bookId)
    if (book && book.status === 'available') {
      book.status = 'borrowed'
      book.borrowedBy = 'JM'
      const due = new Date()
      due.setDate(due.getDate() + 14)
      book.dueDate = due.toISOString().split('T')[0]
      this.addNotification(`You borrowed "${book.title}"`, 'success')
      return true
    }
    return false
  },

  reserveBook(bookId) {
    const book = this.books.find(b => b.id === bookId)
    if (book) {
      this.reservations.push({ bookId, userId: 'JM', position: 3, date: new Date() })
      this.addNotification(`Reserved "${book.title}" – Queue position #3`, 'info')
      return true
    }
    return false
  },

  renewBook(bookId) {
    const book = this.books.find(b => b.id === bookId && b.borrowedBy === 'JM')
    if (book) {
      const due = new Date(book.dueDate)
      due.setDate(due.getDate() + 14)
      book.dueDate = due.toISOString().split('T')[0]
      if (book.status === 'overdue') { book.status = 'borrowed'; book.fine = 0 }
      this.addNotification(`Renewed "${book.title}" for 14 more days`, 'success')
      return true
    }
    return false
  },

  addNotification(message, type = 'info') {
    const id = Date.now()
    this.notifications.push({ id, message, type })
    setTimeout(() => {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }, 3500)
  },

  getCategories() {
    return [...new Set(this.books.map(b => b.category))]
  }
})
