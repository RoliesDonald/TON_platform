/**
 * PostgreSQL Database Connection
 * Direct PostgreSQL implementation based on Prisma schema
 */

import { Pool, PoolClient, QueryResult } from 'pg';

// Check if mock data mode is enabled
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'ton_database',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
};

// Create connection pool only if not using mock data
let pool: Pool | null = null;
if (!useMockData) {
  pool = new Pool(dbConfig);

  // Test database connection
  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
} else {
  console.log('Mock data mode enabled - PostgreSQL connection disabled');
}

// Database helper interface
export interface DatabaseHelper {
  // Companies
  findCompanyById(id: string): Promise<any>;
  findCompanyByCompanyId(companyId: string): Promise<any>;
  findCompaniesByType(type: string): Promise<any>;
  createCompany(data: any): Promise<any>;
  updateCompany(id: string, data: any): Promise<any>;

  // Employees
  findEmployeeById(id: string): Promise<any>;
  findEmployeeByEmail(email: string): Promise<any>;
  findEmployeesByCompany(companyId: string): Promise<any>;
  createEmployee(data: any): Promise<any>;
  updateEmployee(id: string, data: any): Promise<any>;

  // Vehicles
  findVehicleById(id: string): Promise<any>;
  findVehiclesByCompany(companyId: string): Promise<any>;
  createVehicle(data: any): Promise<any>;
  updateVehicle(id: string, data: any): Promise<any>;
  deleteVehicle(id: string): Promise<boolean>;
  searchVehicles(searchTerm: string): Promise<any>;

  // Authentication
  validateSession(sessionId: string): Promise<any>;
  createSession(userId: string): Promise<string>;
  deleteSession(sessionId: string): Promise<boolean>;
}

class PostgreSQLDatabase implements DatabaseHelper {
  private pool: Pool | null;

  constructor(pool: Pool | null) {
    this.pool = pool;
  }

  // Helper method to execute queries
  private async query(text: string, params?: any[]): Promise<QueryResult> {
    // If mock data mode is enabled, return empty result
    if (!this.pool) {
      console.log('Mock data mode: Returning empty result for query:', { text, params });
      return { rows: [], rowCount: 0 } as QueryResult;
    }

    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: result.rowCount });
      return result;
    } catch (error) {
      console.error('Database query error', { text, error });
      throw error;
    }
  }

  // Helper method to get single record
  private async getOne(text: string, params?: any[]): Promise<any | null> {
    const result = await this.query(text, params);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Helper method to get multiple records
  private async getMany(text: string, params?: any[]): Promise<any[]> {
    const result = await this.query(text, params);
    return result.rows;
  }

  // =================================================================
  // COMPANIES
  // =================================================================

  async findCompanyById(id: string): Promise<any> {
    const query = `
      SELECT
        c.*,
        parent.company_name as parent_company_name,
        parent.company_id as parent_company_id
      FROM companies c
      LEFT JOIN companies parent ON c.parent_company_id = parent.id
      WHERE c.id = $1
    `;
    return this.getOne(query, [id]);
  }

  async findCompanyByCompanyId(companyId: string): Promise<any> {
    const query = `
      SELECT
        c.*,
        parent.company_name as parent_company_name,
        parent.company_id as parent_company_id
      FROM companies c
      LEFT JOIN companies parent ON c.parent_company_id = parent.id
      WHERE c.company_id = $1
    `;
    return this.getOne(query, [companyId]);
  }

  async findCompaniesByType(type: string): Promise<any[]> {
    const query = `
      SELECT
        c.*,
        parent.company_name as parent_company_name
      FROM companies c
      LEFT JOIN companies parent ON c.parent_company_id = parent.id
      WHERE c.company_type = $1 AND c.status = 'ACTIVE'
      ORDER BY c.company_name
    `;
    return this.getMany(query, [type]);
  }

  async createCompany(data: any): Promise<any> {
    const query = `
      INSERT INTO companies (
        company_id, company_name, company_email, logo, contact, address, city,
        tax_registered, company_type, status, company_role, parent_company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    const params = [
      data.companyId,
      data.companyName,
      data.companyEmail || null,
      data.logo || null,
      data.contact || null,
      data.address || null,
      data.city || null,
      data.taxRegistered || false,
      data.companyType,
      data.status || 'ACTIVE',
      data.companyRole,
      data.parentCompanyId || null
    ];
    return this.getOne(query, params);
  }

  async updateCompany(id: string, data: any): Promise<any> {
    const query = `
      UPDATE companies SET
        company_name = COALESCE($2, company_name),
        company_email = COALESCE($3, company_email),
        logo = COALESCE($4, logo),
        contact = COALESCE($5, contact),
        address = COALESCE($6, address),
        city = COALESCE($7, city),
        tax_registered = COALESCE($8, tax_registered),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const params = [
      id,
      data.companyName,
      data.companyEmail,
      data.logo,
      data.contact,
      data.address,
      data.city,
      data.taxRegistered,
      data.status
    ];
    return this.getOne(query, params);
  }

  // =================================================================
  // EMPLOYEES
  // =================================================================

  async findEmployeeById(id: string): Promise<any> {
    const query = `
      SELECT
        e.*,
        c.company_name,
        c.company_id,
        c.company_type
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE e.id = $1
    `;
    return this.getOne(query, [id]);
  }

  async findEmployeeByEmail(email: string): Promise<any> {
    const query = `
      SELECT
        e.*,
        c.company_name,
        c.company_id,
        c.company_type
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE e.email = $1
    `;
    return this.getOne(query, [email]);
  }

  async findEmployeesByCompany(companyId: string): Promise<any[]> {
    const query = `
      SELECT
        e.id,
        e.employee_id,
        e.name,
        e.email,
        e.role,
        e.position,
        e.status,
        e.department,
        e.phone_number,
        e.photo
      FROM employees e
      WHERE e.company_id = $1 AND e.status = 'ACTIVE'
      ORDER BY e.name
    `;
    return this.getMany(query, [companyId]);
  }

  async createEmployee(data: any): Promise<any> {
    const query = `
      INSERT INTO employees (
        employee_id, name, email, password, phone_number, address,
        position, role, department, status, tanggal_lahir, tanggal_bergabung,
        gender, company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const params = [
      data.employeeId,
      data.name,
      data.email,
      data.password,
      data.phoneNumber || null,
      data.address || null,
      data.position || null,
      data.role || 'USER',
      data.department || null,
      data.status || 'ACTIVE',
      data.tanggalLahir || null,
      data.tanggalBergabung || null,
      data.gender,
      data.companyId
    ];
    return this.getOne(query, params);
  }

  async updateEmployee(id: string, data: any): Promise<any> {
    const query = `
      UPDATE employees SET
        name = COALESCE($2, name),
        email = COALESCE($3, email),
        phone_number = COALESCE($4, phone_number),
        address = COALESCE($5, address),
        position = COALESCE($6, position),
        role = COALESCE($7, role),
        department = COALESCE($8, department),
        status = COALESCE($9, status),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const params = [
      id,
      data.name,
      data.email,
      data.phoneNumber,
      data.address,
      data.position,
      data.role,
      data.department,
      data.status
    ];
    return this.getOne(query, params);
  }

  // =================================================================
  // VEHICLES
  // =================================================================

  async findVehicleById(id: string): Promise<any> {
    const query = `
      SELECT
        v.*,
        owner_company.company_name as owner_company_name,
        owner_company.company_id as owner_company_id,
        car_user_company.company_name as car_user_company_name,
        car_user_company.company_id as car_user_company_id
      FROM vehicles v
      LEFT JOIN companies owner_company ON v.owner_id = owner_company.id
      LEFT JOIN companies car_user_company ON v.car_user_id = car_user_company.id
      WHERE v.id = $1
    `;
    return this.getOne(query, [id]);
  }

  async findVehiclesByCompany(companyId: string): Promise<any[]> {
    const query = `
      SELECT
        v.*,
        owner_company.company_name as owner_company_name,
        owner_company.company_id as owner_company_id,
        car_user_company.company_name as car_user_company_name,
        car_user_company.company_id as car_user_company_id
      FROM vehicles v
      LEFT JOIN companies owner_company ON v.owner_id = owner_company.id
      LEFT JOIN companies car_user_company ON v.car_user_id = car_user_company.id
      WHERE v.owner_id = $1 OR v.car_user_id = $1
      ORDER BY v.created_at DESC
    `;
    return this.getMany(query, [companyId]);
  }

  async createVehicle(data: any): Promise<any> {
    const query = `
      INSERT INTO vehicles (
        license_plate, vehicle_make, model, trim_level, vin_num, engine_num,
        chassis_num, year_made, color, start_rent_date, end_rent_date,
        vehicle_type, vehicle_category, fuel_type, transmission_type,
        last_odometer, last_service_date, status, notes, photo, description,
        owner_id, car_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
      RETURNING *
    `;
    const params = [
      data.licensePlate,
      data.vehicleMake,
      data.model,
      data.trimLevel || null,
      data.vinNum || null,
      data.engineNum || null,
      data.chassisNum || null,
      data.yearMade,
      data.color,
      data.startRentDate || null,
      data.endRentDate || null,
      data.vehicleType,
      data.vehicleCategory,
      data.fuelType,
      data.transmissionType,
      data.lastOdometer,
      data.lastServiceDate || null,
      data.status,
      data.notes || null,
      data.photo || null,
      data.description || null,
      data.ownerId,
      data.carUserId || null
    ];
    return this.getOne(query, params);
  }

  async updateVehicle(id: string, data: any): Promise<any> {
    const query = `
      UPDATE vehicles SET
        license_plate = COALESCE($2, license_plate),
        vehicle_make = COALESCE($3, vehicle_make),
        model = COALESCE($4, model),
        trim_level = COALESCE($5, trim_level),
        color = COALESCE($6, color),
        year_made = COALESCE($7, year_made),
        last_odometer = COALESCE($8, last_odometer),
        status = COALESCE($9, status),
        notes = COALESCE($10, notes),
        photo = COALESCE($11, photo),
        description = COALESCE($12, description),
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const params = [
      id,
      data.licensePlate,
      data.vehicleMake,
      data.model,
      data.trimLevel,
      data.color,
      data.yearMade,
      data.lastOdometer,
      data.status,
      data.notes,
      data.photo,
      data.description
    ];
    return this.getOne(query, params);
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const query = 'DELETE FROM vehicles WHERE id = $1';
    const result = await this.query(query, [id]);
    return result.rowCount > 0;
  }

  async searchVehicles(searchTerm: string): Promise<any[]> {
    const query = `
      SELECT
        v.*,
        owner_company.company_name as owner_company_name,
        car_user_company.company_name as car_user_company_name
      FROM vehicles v
      LEFT JOIN companies owner_company ON v.owner_id = owner_company.id
      LEFT JOIN companies car_user_company ON v.car_user_id = car_user_company.id
      WHERE
        v.license_plate ILIKE $1 OR
        v.vehicle_make ILIKE $1 OR
        v.model ILIKE $1 OR
        v.vin_num ILIKE $1
      ORDER BY v.created_at DESC
      LIMIT 50
    `;
    return this.getMany(query, [`%${searchTerm}%`]);
  }

  // =================================================================
  // AUTHENTICATION
  // =================================================================

  async validateSession(sessionId: string): Promise<any> {
    const query = `
      SELECT
        s.id as session_id,
        s.user_id,
        s.valid,
        e.*,
        c.company_name,
        c.company_id,
        c.company_type
      FROM sessions s
      LEFT JOIN employees e ON s.user_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE s.id = $1 AND s.valid = true
    `;
    return this.getOne(query, [sessionId]);
  }

  async createSession(userId: string): Promise<string> {
    // First invalidate existing sessions for this user
    await this.query('UPDATE sessions SET valid = false WHERE user_id = $1', [userId]);

    // Create new session
    const query = 'INSERT INTO sessions (user_id, valid) VALUES ($1, true) RETURNING id';
    const result = await this.getOne(query, [userId]);
    return result.id;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const query = 'UPDATE sessions SET valid = false WHERE id = $1';
    const result = await this.query(query, [sessionId]);
    return result.rowCount > 0;
  }
}

// Export database instance
export const db = new PostgreSQLDatabase(pool);

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  if (useMockData) {
    console.log('Mock data mode - Database health check skipped');
    return true;
  }

  try {
    await db.query('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export pool for direct access if needed
export { pool };

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing database connections...');
  if (pool) {
    await pool.end();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing database connections...');
  if (pool) {
    await pool.end();
  }
  process.exit(0);
});