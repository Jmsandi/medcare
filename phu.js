// Enhanced mock data
const mockData = {
    medications: [
        { name: 'Paracetamol', stock: 500, unit: 'tablets', status: 'In Stock' },
        { name: 'Amoxicillin', stock: 200, unit: 'capsules', status: 'Medium Stock' },
        { name: 'Ibuprofen', stock: 150, unit: 'tablets', status: 'Low Stock' },
        { name: 'Omeprazole', stock: 300, unit: 'capsules', status: 'Medium Stock' },
        { name: 'Metformin', stock: 400, unit: 'tablets', status: 'In Stock' },
        { name: 'Aspirin', stock: 80, unit: 'tablets', status: 'Low Stock' }
    ],
    staff: [
        { id: 'STF001', name: 'Dr. John Smith', role: 'Physician', status: 'On Duty', department: 'General Medicine' },
        { id: 'STF002', name: 'Nurse Sarah', role: 'Head Nurse', status: 'On Duty', department: 'Emergency' },
        { id: 'STF003', name: 'Dr. Mary Johnson', role: 'Pediatrician', status: 'Off Duty', department: 'Pediatrics' },
        { id: 'STF004', name: 'Dr. James Wilson', role: 'Surgeon', status: 'On Leave', department: 'Surgery' },
        { id: 'STF005', name: 'Nurse Michael', role: 'Staff Nurse', status: 'On Duty', department: 'ICU' }
    ],
    appointments: [
        { time: '09:00', patient: 'John Doe', type: 'Check-up', status: 'Scheduled', doctor: 'Dr. Smith' },
        { time: '09:30', patient: 'Jane Smith', type: 'Vaccination', status: 'In Progress', doctor: 'Dr. Johnson' },
        { time: '10:00', patient: 'Bob Wilson', type: 'Follow-up', status: 'Completed', doctor: 'Dr. Smith' },
        { time: '10:30', patient: 'Alice Brown', type: 'Consultation', status: 'Scheduled', doctor: 'Dr. Wilson' },
        { time: '11:00', patient: 'Charlie Davis', type: 'Emergency', status: 'In Progress', doctor: 'Dr. Smith' }
    ],
    emergencies: [
        { id: 'EMG001', type: 'Trauma', status: 'Active', priority: 'High', location: 'Emergency Room 1' },
        { id: 'EMG002', type: 'Cardiac', status: 'Responding', priority: 'Critical', location: 'ICU' },
        { id: 'EMG003', type: 'Respiratory', status: 'Pending', priority: 'Medium', location: 'Emergency Room 2' }
    ],
    visitTrends: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [15, 20, 18, 25, 23, 12, 10]
    },
    diseases: [
        { name: 'Influenza', cases: 12, trend: 'increasing', weeklyChange: '+15%' },
        { name: 'Dengue', cases: 3, trend: 'stable', weeklyChange: '0%' },
        { name: 'COVID-19', cases: 8, trend: 'decreasing', weeklyChange: '-20%' },
        { name: 'Malaria', cases: 5, trend: 'increasing', weeklyChange: '+10%' }
    ]
};

// Initialize all charts and data displays
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    initializeAppointments();
    initializeMedications();
    initializeStaffDirectory();
    initializeEmergencyResponse(); 
    initializeCommunityHealth();
    setupEventListeners();
    showSection('dashboard'); // Show dashboard by default
});

function initializeDashboard() {
    // Patient Visits Chart
    const visitCtx = document.getElementById('visitTrendsChart').getContext('2d');
    new Chart(visitCtx, {
        type: 'line',
        data: {
            labels: mockData.visitTrends.labels,
            datasets: [{
                label: 'Patient Visits',
                data: mockData.visitTrends.data,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // New chart initializations
    initializeDepartmentLoadChart();
    initializeResourceUtilizationChart();
    initializeDemographicsChart();

    // Update dashboard stats
    updateDashboardStats();
}

function updateDashboardStats() {
    const stats = {
        todayPatients: mockData.appointments.length,
        activeEmergencies: mockData.emergencies.filter(e => e.status === 'Active').length,
        availableStaff: mockData.staff.filter(s => s.status === 'On Duty').length,
        totalMedications: mockData.medications.length
    };

    document.querySelectorAll('[data-stat]').forEach(element => {
        const statKey = element.getAttribute('data-stat');
        if (stats[statKey] !== undefined) {
            element.textContent = stats[statKey];
        }
    });
}

function initializeAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;

    const appointmentsHTML = mockData.appointments.map(appointment => `
        <tr>
            <td class="px-6 py-4">${appointment.time}</td>
            <td class="px-6 py-4">${appointment.patient}</td>
            <td class="px-6 py-4">${appointment.type}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs ${getStatusColor(appointment.status)}">
                    ${appointment.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <button class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="text-red-600 hover:text-red-800">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `).join('');

    appointmentsList.innerHTML = appointmentsHTML;
}

function getStatusColor(status) {
    const colors = {
        'Scheduled': 'bg-yellow-100 text-yellow-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-green-100 text-green-800',
        'Cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function initializeMedications() {
    const medicationsList = document.getElementById('medicationsList');
    if (!medicationsList) return;

    const medicationsHTML = mockData.medications.map(medication => `
        <tr>
            <td class="px-6 py-4">${medication.name}</td>
            <td class="px-6 py-4">${medication.stock}</td>
            <td class="px-6 py-4">${medication.unit}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs ${getStockStatusColor(medication.stock)}">
                    ${getStockStatus(medication.stock)}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-green-600 hover:text-green-800">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    medicationsList.innerHTML = medicationsHTML;
}

function setupEventListeners() {
    // Add search functionality for medications
    const medicationSearch = document.getElementById('medicationSearch');
    if (medicationSearch) {
        medicationSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredMeds = mockData.medications.filter(med => 
                med.name.toLowerCase().includes(searchTerm)
            );
            renderMedicationsList(filteredMeds);
        });
    }

    // Add search functionality for staff
    const staffSearch = document.getElementById('staffSearch');
    if (staffSearch) {
        staffSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredStaff = mockData.staff.filter(staff => 
                staff.name.toLowerCase().includes(searchTerm) || 
                staff.role.toLowerCase().includes(searchTerm)
            );
            renderStaffList(filteredStaff);
        });
    }
}

// Additional helper functions
function getStockStatus(stock) {
    if (stock <= 100) return 'Low Stock';
    if (stock <= 300) return 'Medium Stock';
    return 'In Stock';
}

function getStockStatusColor(stock) {
    if (stock <= 100) return 'bg-red-100 text-red-800';
    if (stock <= 300) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
}

// Add this function to handle section navigation
function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    // Update navigation link active states
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('bg-green-700');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('bg-green-700');
        }
    });
}

// Add click handlers to all navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        showSection(section);
    });
});

// Show dashboard by default on page load
document.addEventListener('DOMContentLoaded', () => {
    showSection('dashboard');
});

// Add these functions to initialize additional sections

function initializeStaffDirectory() {
    const staffList = document.getElementById('staffList');
    if (!staffList) return;

    const staffHTML = mockData.staff.map(staff => `
        <tr>
            <td class="px-6 py-4">${staff.id}</td>
            <td class="px-6 py-4">${staff.name}</td>
            <td class="px-6 py-4">${staff.role}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs ${getStaffStatusColor(staff.status)}">
                    ${staff.status}
                </span>
            </td>
            <td class="px-6 py-4">
                <div class="flex space-x-2">
                    <button class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    staffList.innerHTML = staffHTML;
}

function initializeCommunityHealth() {
    // Existing disease surveillance code
    const diseaseList = document.getElementById('diseaseSurveillance');
    if (diseaseList) {
        const diseasesHTML = mockData.diseases.map(disease => `
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-semibold">${disease.name}</h4>
                    <p class="text-sm text-gray-500">Active Cases: ${disease.cases}</p>
                </div>
                <div>
                    <span class="px-2 py-1 rounded-full text-xs ${getTrendColor(disease.trend)}">
                        ${disease.weeklyChange}
                    </span>
                </div>
            </div>
        `).join('');

        diseaseList.innerHTML = diseasesHTML;
    }

    // Initialize Disease Distribution Chart
    const diseaseCtx = document.getElementById('diseaseDistributionChart')?.getContext('2d');
    if (diseaseCtx) {
        new Chart(diseaseCtx, {
            type: 'doughnut',
            data: {
                labels: mockData.diseases.map(d => d.name),
                datasets: [{
                    data: mockData.diseases.map(d => d.cases),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: 'white',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    // Initialize Health Trends Chart
    const trendsCtx = document.getElementById('healthTrendsChart')?.getContext('2d');
    if (trendsCtx) {
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: mockData.diseases.map((disease, index) => ({
                    label: disease.name,
                    data: generateRandomData(6, 5, 20), // Generate random data for demonstration
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                    ][index],
                    tension: 0.3,
                    fill: false
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Helper function to generate random data for the trends chart
function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function getStaffStatusColor(status) {
    const colors = {
        'On Duty': 'bg-green-100 text-green-800',
        'Off Duty': 'bg-red-100 text-red-800',
        'On Leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function getTrendColor(trend) {
    const colors = {
        'increasing': 'bg-red-100 text-red-800', 
        'decreasing': 'bg-green-100 text-green-800',
        'stable': 'bg-blue-100 text-blue-800'
    };
    return colors[trend] || 'bg-gray-100 text-gray-800';
}

function initializeEmergencyResponse() {
    const emergencySection = document.getElementById('emergency');
    if (!emergencySection) return;

    const emergencyContent = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            ${mockData.emergencies.map(emergency => `
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-semibold">${emergency.type}</h3>
                        <span class="px-2 py-1 rounded-full text-xs ${getEmergencyPriorityColor(emergency.priority)}">
                            ${emergency.priority}
                        </span>
                    </div>
                    <div class="mt-4">
                        <p>Status: ${emergency.status}</p>
                        <p>Location: ${emergency.location}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    // Add the emergency content after the header
    const headerElement = emergencySection.querySelector('div');
    headerElement.insertAdjacentHTML('afterend', emergencyContent);
}

function getEmergencyPriorityColor(priority) {
    const colors = {
        'Critical': 'bg-red-100 text-red-800',
        'High': 'bg-orange-100 text-orange-800', 
        'Medium': 'bg-yellow-100 text-yellow-800',
        'Low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
}

function initializeDepartmentLoadChart() {
    const ctx = document.getElementById('departmentLoadChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['General', 'Pediatrics', 'Emergency', 'Vaccination', 'Maternity'],
            datasets: [{
                label: 'Patient Load',
                data: [65, 45, 28, 35, 20],
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeResourceUtilizationChart() {
    const ctx = document.getElementById('resourceUtilizationChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Use', 'Available', 'Maintenance'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initializeDemographicsChart() {
    const ctx = document.getElementById('demographicsChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Children', 'Adults', 'Elderly'],
            datasets: [{
                data: [30, 45, 25],
                backgroundColor: [
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}