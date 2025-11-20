# NestJS 用户权限管理模块目录结构建议

## 模块间关系和依赖说明

### 1. 实体关系

```
User (用户) <-> Role (角色): 多对多关系
Role (角色) <-> Permission (权限): 多对多关系
Role (角色) <-> Menu (菜单): 多对多关系
User (用户) <-> Profile (扩展信息): 一对一关系
```

### 2. 模块依赖关系

```
UserModule 依赖于:
├── TypeOrmModule (实体管理)
├── JwtModule (认证)
├── RoleModule (角色关联)
└── AuthModule (认证核心)

RoleModule 依赖于:
├── TypeOrmModule (实体管理)
├── PermissionModule (权限关联)
└── MenuModule (菜单关联)

PermissionModule 依赖于:
└── TypeOrmModule (实体管理)

MenuModule 依赖于:
└── TypeOrmModule (实体管理)

AuthModule 依赖于:
├── JwtModule (JWT实现)
├── PassportModule (认证策略)
└── UserModule (用户验证)

SharedModule 依赖于:
└── TypeOrmModule (关联表实体)
```

### 3. 权限管理流程

```
1. 用户登录 -> AuthService 验证凭据 -> 生成JWT Token
2. 请求资源 -> AuthGuard 验证Token -> RoleGuard 验证角色权限
3. 权限检查 -> 验证用户角色是否拥有操作权限
4. 资源访问 -> 基于权限允许或拒绝访问
```

## 1. 用户模块 (User Module) 详细结构

```
src/
├── user/                   # 用户主模块
│   ├── dto/                # 数据传输对象
│   │   ├── create-user.dto.ts
│   │   ├── update-user.dto.ts
│   │   ├── login-user.dto.ts
│   │   ├── query-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── entities/           # 实体定义
│   │   ├── user.entity.ts
│   │   └── profile.entity.ts     # 用户扩展信息
│   ├── controllers/        # 控制器（推荐按功能分组）
│   │   ├── user.controller.ts    # 基本用户管理
│   │   ├── auth.controller.ts    # 认证相关（登录、注册等）
│   │   └── profile.controller.ts # 个人资料管理
│   ├── services/           # 服务层
│   │   ├── user.service.ts
│   │   ├── auth.service.ts
│   │   └── profile.service.ts
│   ├── repositories/       # 数据访问层（可选，TypeORM可直接使用Repository）
│   │   └── user.repository.ts
│   ├── guards/             # 守卫
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── strategies/         # 策略
│   │   └── jwt.strategy.ts
│   ├── decorators/         # 自定义装饰器
│   │   ├── roles.decorator.ts
│   │   └── current-user.decorator.ts
│   ├── pipes/              # 管道
│   │   └── user-validation.pipe.ts
│   ├── schemas/            # 用于DTO验证的schema（如果需要）
│   │   └── user.schema.ts
│   ├── user.module.ts      # 用户模块主文件
│   └── user.constants.ts   # 常量定义
```

## 2. 角色模块 (Role Module) 详细结构

```
src/
├── role/                   # 角色模块
│   ├── dto/                # 数据传输对象
│   │   ├── create-role.dto.ts
│   │   ├── update-role.dto.ts
│   │   └── query-role.dto.ts
│   ├── entities/           # 实体定义
│   │   └── role.entity.ts
│   ├── controllers/        # 控制器
│   │   └── role.controller.ts
│   ├── services/           # 服务层
│   │   └── role.service.ts
│   ├── repositories/       # 数据访问层（可选）
│   │   └── role.repository.ts
│   ├── role.module.ts      # 角色模块主文件
│   └── role.constants.ts   # 常量定义
```

## 3. 权限模块 (Permission Module) 详细结构

```
src/
├── permission/             # 权限模块
│   ├── dto/                # 数据传输对象
│   │   ├── create-permission.dto.ts
│   │   ├── update-permission.dto.ts
│   │   └── query-permission.dto.ts
│   ├── entities/           # 实体定义
│   │   └── permission.entity.ts
│   ├── controllers/        # 控制器
│   │   └── permission.controller.ts
│   ├── services/           # 服务层
│   │   └── permission.service.ts
│   ├── repositories/       # 数据访问层（可选）
│   │   └── permission.repository.ts
│   ├── permission.module.ts # 权限模块主文件
│   └── permission.constants.ts # 常量定义
```

## 4. 菜单模块 (Menu Module) 详细结构

```
src/
├── menu/                   # 菜单模块
│   ├── dto/                # 数据传输对象
│   │   ├── create-menu.dto.ts
│   │   ├── update-menu.dto.ts
│   │   └── query-menu.dto.ts
│   ├── entities/           # 实体定义
│   │   └── menu.entity.ts
│   ├── controllers/        # 控制器
│   │   └── menu.controller.ts
│   ├── services/           # 服务层
│   │   └── menu.service.ts
│   ├── repositories/       # 数据访问层（可选）
│   │   └── menu.repository.ts
│   ├── menu.module.ts      # 菜单模块主文件
│   └── menu.constants.ts   # 常量定义
```

## 5. 关联表和共享组件

```
src/
├── shared/                 # 共享模块
│   ├── entities/           # 共享实体（关联表）
│   │   ├── user-role.entity.ts    # 用户-角色关联表
│   │   ├── role-permission.entity.ts # 角色-权限关联表
│   │   └── role-menu.entity.ts    # 角色-菜单关联表
│   ├── decorators/         # 共享装饰器
│   │   └── api-common.decorator.ts
│   ├── pipes/              # 共享管道
│   │   └── validation.pipe.ts
│   └── shared.module.ts    # 共享模块主文件
└── auth/                   # 认证核心模块
    ├── jwt/                # JWT相关
    │   ├── jwt.module.ts
    │   └── jwt.service.ts
    ├── passport/           # Passport配置
    │   └── passport.module.ts
    └── auth.module.ts      # 认证模块主文件
```

## 6. 完整的权限管理功能模块集成

```
src/
├── user/                   # 用户模块（按上面的详细结构）
├── role/                   # 角色模块（按上面的详细结构）
├── permission/             # 权限模块（按上面的详细结构）
├── menu/                   # 菜单模块（按上面的详细结构）
├── shared/                 # 共享模块（按上面的详细结构）
├── auth/                   # 认证模块（按上面的详细结构）
└── permission-management/  # 权限管理集成模块（可选）
    ├── controllers/
    │   └── permission-management.controller.ts
    ├── services/
    │   └── permission-management.service.ts
    └── permission-management.module.ts
```

## 实现建议和最佳实践

### 1. 模块化设计

- **使用功能模块**：每个主要功能（用户、角色、权限、菜单）都应该是独立的模块，遵循单一职责原则
- **共享模块**：将通用组件、实体和工具放在shared模块中，避免重复代码
- **动态模块**：对于需要配置的模块（如JwtModule），使用动态模块模式

```typescript
// 动态模块示例
@Module({})
export class ConfigurableModule {
  static forRoot(options: ModuleOptions): DynamicModule {
    return {
      module: ConfigurableModule,
      providers: [
        { provide: MODULE_OPTIONS, useValue: options },
        ConfigurableService,
      ],
      exports: [ConfigurableService],
    };
  }
}
```

### 2. 分层架构

- **控制器层**：处理HTTP请求，参数验证，返回响应
- **服务层**：实现业务逻辑，协调不同实体和服务
- **存储库层**：处理数据访问（可选，TypeORM可直接使用Repository）
- **实体层**：定义数据模型和关系

### 3. 权限和安全

- **使用守卫**：实现AuthGuard和RoleGuard来保护路由
- **装饰器**：创建自定义装饰器如@Roles()和@CurrentUser()简化权限检查
- **JWT最佳实践**：
  - 设置合理的过期时间
  - 使用刷新令牌机制
  - 存储敏感信息时使用加密

```typescript
// RoleGuard示例
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // 检查用户是否拥有所需角色
    return requiredRoles.some(role => user.roles.includes(role));
  }
}
```

### 4. 数据传输对象（DTO）

- **请求DTO**：验证和清理输入数据
- **响应DTO**：控制API响应的结构，避免返回敏感信息
- **使用class-validator**：为DTO添加验证规则

### 5. 错误处理

- **统一异常过滤器**：处理全局异常，返回一致的错误格式
- **业务异常**：创建自定义业务异常类
- **日志记录**：记录错误和异常信息

### 6. 数据库设计

- **关联表**：使用中间表管理多对多关系
- **软删除**：对重要数据使用软删除功能
- **索引**：为常用查询字段添加索引

### 7. API文档

- **使用Swagger**：自动生成API文档
- **添加详细注释**：为控制器、方法和参数添加说明
- **示例响应**：提供请求和响应示例

### 8. 测试

- **单元测试**：测试各个组件的功能
- **集成测试**：测试组件间的交互
- **E2E测试**：测试完整的API流程

### 9. 性能优化

- **延迟加载**：对关联数据使用延迟加载
- **缓存机制**：缓存常用数据如权限和菜单配置
- **分页查询**：对大数据集使用分页

通过遵循这些最佳实践，可以构建一个可维护、安全且高性能的用户权限管理系统，充分利用NestJS框架的优势。