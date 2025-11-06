# Day 5: Linux 服务器基础 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 熟练使用 Linux 常用命令进行文件操作、进程管理和网络配置
- 理解和掌握 Linux 文件权限系统，能够使用 chmod 和 chown 管理文件权限
- 掌握进程管理工具 pm2 和 systemd，能够配置服务守护进程
- 理解防火墙工作原理，能够使用 iptables 和 ufw 配置防火墙规则
- 掌握用户和权限管理，能够配置 sudo 和 SSH 密钥登录
- 具备在 Linux 服务器上进行基础运维的能力

## 核心知识点

### 1. Linux 常用命令

#### 1.1 文件操作命令

**文件和目录操作**

**ls - 列出目录内容**

```bash
# 基本用法
ls                    # 列出当前目录内容
ls -l                 # 详细列表（长格式）
ls -a                 # 显示所有文件（包括隐藏文件）
ls -lh                # 人类可读的文件大小格式
ls -la                # 组合使用：显示所有文件的详细信息
ls -lt                # 按修改时间排序
ls -lS                # 按文件大小排序

# 常用组合
ls -lah               # 显示所有文件，人类可读大小，详细格式
ls -lR                # 递归显示子目录
```

**cd - 切换目录**

```bash
cd                    # 切换到用户主目录
cd ~                  # 切换到用户主目录
cd -                  # 切换到上次访问的目录
cd ..                 # 切换到上一级目录
cd /path/to/dir       # 切换到绝对路径
cd ../dir             # 切换到相对路径
```

**pwd - 显示当前目录**

```bash
pwd                   # 显示当前工作目录的绝对路径
```

**mkdir - 创建目录**

```bash
mkdir dirname         # 创建单个目录
mkdir -p dir1/dir2    # 递归创建目录（如果父目录不存在也会创建）
mkdir dir1 dir2 dir3  # 创建多个目录
```

**rm - 删除文件或目录**

```bash
rm filename           # 删除文件
rm -r dirname         # 递归删除目录
rm -rf dirname        # 强制递归删除（危险操作，谨慎使用）
rm -i filename        # 交互式删除（删除前确认）
```

**cp - 复制文件或目录**

```bash
cp source dest        # 复制文件
cp -r source dest     # 递归复制目录
cp -a source dest     # 归档模式（保留权限、时间戳等）
cp -v source dest     # 显示详细过程
```

**mv - 移动或重命名文件**

```bash
mv source dest        # 移动或重命名文件
mv file1 file2 dir/   # 移动多个文件到目录
```

**cat - 查看文件内容**

```bash
cat filename          # 显示文件全部内容
cat file1 file2       # 合并显示多个文件
cat > filename        # 创建新文件（输入内容后按 Ctrl+D 保存）
cat >> filename       # 追加内容到文件
```

**less / more - 分页查看文件**

```bash
less filename         # 分页查看文件（推荐，功能更强大）
more filename         # 分页查看文件

# less 快捷键：
# 空格键：向下翻页
# b：向上翻页
# /keyword：搜索
# q：退出
```

**head / tail - 查看文件开头或结尾**

```bash
head filename         # 显示文件前 10 行
head -n 20 filename   # 显示文件前 20 行
tail filename         # 显示文件后 10 行
tail -n 20 filename   # 显示文件后 20 行
tail -f filename      # 实时监控文件变化（常用于查看日志）
```

**find - 查找文件**

```bash
find . -name "*.js"           # 查找当前目录下所有 .js 文件
find /var/log -name "*.log"   # 查找指定目录下的 .log 文件
find . -type f                # 查找所有文件
find . -type d                # 查找所有目录
find . -size +100M            # 查找大于 100MB 的文件
find . -mtime -7              # 查找 7 天内修改的文件
find . -name "*.js" -exec rm {} \;  # 查找并删除
```

**grep - 文本搜索**

```bash
grep "keyword" filename       # 在文件中搜索关键词
grep -r "keyword" dir/        # 递归搜索目录
grep -i "keyword" filename    # 忽略大小写
grep -n "keyword" filename    # 显示行号
grep -v "keyword" filename    # 显示不包含关键词的行
grep -E "pattern" filename    # 使用扩展正则表达式
```

**tar - 归档和压缩**

```bash
# 创建归档
tar -czf archive.tar.gz dir/  # 创建 gzip 压缩的归档
tar -xzf archive.tar.gz       # 解压 gzip 归档
tar -cjf archive.tar.bz2 dir/ # 创建 bzip2 压缩的归档
tar -xjf archive.tar.bz2      # 解压 bzip2 归档

# 参数说明：
# -c: 创建归档
# -x: 解压归档
# -z: 使用 gzip
# -j: 使用 bzip2
# -f: 指定文件名
# -v: 显示详细过程
```

#### 1.2 进程管理命令

**ps - 查看进程**

```bash
ps                    # 显示当前终端进程
ps aux                # 显示所有进程（BSD 风格）
ps -ef                # 显示所有进程（System V 风格）
ps aux | grep nginx   # 查找特定进程
ps -p PID             # 查看指定 PID 的进程
```

**top / htop - 实时进程监控**

```bash
top                   # 实时显示进程状态（按 q 退出）
htop                  # 更友好的进程监控工具（需要安装）

# top 快捷键：
# q: 退出
# k: 杀死进程
# M: 按内存排序
# P: 按 CPU 排序
```

**kill - 终止进程**

```bash
kill PID              # 终止进程（发送 SIGTERM 信号）
kill -9 PID           # 强制终止进程（发送 SIGKILL 信号）
kill -15 PID          # 优雅终止进程（默认）
killall process_name  # 终止所有同名进程
```

**jobs / fg / bg - 作业控制**

```bash
jobs                  # 查看当前终端的作业
fg %1                 # 将作业 1 切换到前台
bg %1                 # 将作业 1 切换到后台
```

**nohup - 后台运行程序**

```bash
nohup command &       # 在后台运行命令，终端关闭后继续运行
nohup node app.js > output.log 2>&1 &  # 重定向输出到文件
```

**& - 后台运行**

```bash
command &             # 在后台运行命令
```

#### 1.3 网络配置命令

**ifconfig / ip - 网络接口配置**

```bash
# ifconfig（传统命令，部分系统需要安装 net-tools）
ifconfig              # 显示所有网络接口
ifconfig eth0         # 显示指定接口信息
ifconfig eth0 up      # 启用网络接口
ifconfig eth0 down    # 禁用网络接口

# ip（现代推荐命令）
ip addr               # 显示所有 IP 地址
ip addr show eth0     # 显示指定接口的 IP 地址
ip link show          # 显示网络接口
ip route              # 显示路由表
```

**netstat - 网络连接信息**

```bash
netstat -tuln         # 显示所有监听端口（TCP/UDP）
netstat -an           # 显示所有连接
netstat -tulnp        # 显示监听端口和进程信息
netstat -rn           # 显示路由表
```

**ss - 现代网络连接工具（推荐）**

```bash
ss -tuln              # 显示所有监听端口
ss -an                # 显示所有连接
ss -tulnp             # 显示监听端口和进程
ss -t state established  # 显示已建立的连接
```

**ping - 网络连通性测试**

```bash
ping google.com       # 测试网络连通性
ping -c 4 google.com  # 发送 4 个包后停止
ping -i 2 google.com # 每 2 秒发送一个包
```

**curl - 网络请求工具**

```bash
curl http://example.com              # GET 请求
curl -X POST http://api.com/data     # POST 请求
curl -O http://example.com/file.zip # 下载文件
curl -I http://example.com          # 只显示响应头
curl -v http://example.com          # 显示详细信息
```

**wget - 文件下载工具**

```bash
wget http://example.com/file.zip     # 下载文件
wget -O filename.zip URL            # 指定保存文件名
wget -c URL                          # 断点续传
wget -r URL                          # 递归下载
```

**dig / nslookup - DNS 查询**

```bash
dig example.com                      # DNS 查询
dig @8.8.8.8 example.com            # 使用指定 DNS 服务器查询
nslookup example.com                 # DNS 查询（传统命令）
```

**traceroute - 路由追踪**

```bash
traceroute google.com                # 追踪到目标的路由路径
```

#### 1.4 系统信息命令

**uname - 系统信息**

```bash
uname -a             # 显示所有系统信息
uname -s             # 显示系统名称
uname -r             # 显示内核版本
```

**df - 磁盘空间使用情况**

```bash
df -h                # 人类可读格式显示磁盘使用情况
df -i                # 显示 inode 使用情况
```

**du - 目录大小**

```bash
du -h                # 显示当前目录大小（人类可读）
du -sh dir/          # 显示目录总大小
du -h --max-depth=1  # 显示一级子目录大小
```

**free - 内存使用情况**

```bash
free -h              # 显示内存使用情况（人类可读）
free -m              # 以 MB 为单位显示
```

**uptime - 系统运行时间**

```bash
uptime               # 显示系统运行时间和负载
```

**whoami / who - 用户信息**

```bash
whoami               # 显示当前用户名
who                  # 显示当前登录用户
who am i             # 显示当前用户详细信息
```

### 2. 文件权限管理

#### 2.1 Linux 文件权限基础

**权限类型**

Linux 文件系统中有三种基本权限：

- **r (read)**：读权限，值为 4
- **w (write)**：写权限，值为 2
- **x (execute)**：执行权限，值为 1

**权限对象**

文件权限针对三类用户：

- **owner (u)**：文件所有者
- **group (g)**：文件所属组
- **others (o)**：其他用户

**权限表示方式**

**符号表示法（rwx）**

```bash
-rwxr-xr-- 1 user group 1024 Jan 1 10:00 file.txt
```

解释：
- `-`：文件类型（- 普通文件，d 目录，l 链接）
- `rwx`：所有者权限（读、写、执行）
- `r-x`：组权限（读、执行）
- `r--`：其他用户权限（只读）

**数字表示法（八进制）**

```bash
755 = rwxr-xr-x
644 = rw-r--r--
777 = rwxrwxrwx
```

数字计算：
- 7 = 4+2+1 = rwx
- 5 = 4+1 = r-x
- 4 = r--
- 6 = 4+2 = rw-

#### 2.2 chmod - 修改文件权限

**数字模式（推荐）**

```bash
chmod 755 filename    # 设置文件权限为 rwxr-xr-x
chmod 644 filename    # 设置文件权限为 rw-r--r--
chmod 777 dirname     # 设置目录权限为 rwxrwxrwx（不推荐，安全性低）
chmod -R 755 dir/     # 递归设置目录权限
```

**符号模式**

```bash
# 添加权限
chmod u+x filename    # 给所有者添加执行权限
chmod g+w filename    # 给组添加写权限
chmod o+r filename    # 给其他用户添加读权限
chmod a+x filename    # 给所有用户添加执行权限

# 移除权限
chmod u-x filename    # 移除所有者的执行权限
chmod g-w filename    # 移除组的写权限

# 设置权限
chmod u=rwx filename  # 设置所有者权限为 rwx
chmod g=r filename    # 设置组权限为只读
chmod o= filename     # 移除其他用户的所有权限

# 组合使用
chmod u+x,g+w filename           # 多个操作
chmod u=rwx,g=rx,o=r filename    # 设置所有权限
chmod -R u+w dir/                # 递归操作
```

**常用权限设置**

```bash
# 目录权限
chmod 755 dir/       # 目录：所有者可读写执行，其他人可读执行
chmod 700 dir/       # 目录：仅所有者可访问

# 文件权限
chmod 644 file.txt   # 文件：所有者可读写，其他人只读
chmod 600 file.txt   # 文件：仅所有者可读写（敏感文件）
chmod 755 script.sh  # 脚本：需要执行权限

# 递归设置
chmod -R 755 /var/www/html      # Web 目录标准权限
chmod -R 644 /var/www/html/*.html # HTML 文件权限
```

#### 2.3 chown - 修改文件所有者

**基本用法**

```bash
chown user filename           # 修改文件所有者
chown user:group filename     # 修改文件所有者和组
chown :group filename         # 只修改组
chown -R user:group dir/      # 递归修改目录所有权
```

**实际示例**

```bash
# 将文件所有权转移给 www-data 用户
chown www-data:www-data /var/www/html/index.html

# 递归修改 Web 目录所有权
chown -R www-data:www-data /var/www/html

# 只修改组
chown :www-data /var/www/html

# 使用数字 UID/GID
chown 1000:1000 filename
```

**sudo 权限**

某些操作需要 root 权限：

```bash
sudo chown root:root filename
sudo chown -R www-data:www-data /var/www/html
```

#### 2.4 特殊权限

**SUID（Set User ID）**

```bash
chmod u+s filename    # 设置 SUID
chmod 4755 filename   # 数字形式设置 SUID
```

**SGID（Set Group ID）**

```bash
chmod g+s dirname     # 设置 SGID
chmod 2755 dirname    # 数字形式设置 SGID
```

**Sticky Bit**

```bash
chmod +t dirname      # 设置 sticky bit
chmod 1755 dirname    # 数字形式设置 sticky bit
```

#### 2.5 umask - 默认权限掩码

```bash
umask                # 查看当前 umask 值
umask 022            # 设置 umask（新文件权限 = 666 - umask）
umask 027            # 更严格的权限（新文件权限 = 640）
```

**umask 计算示例**

```bash
# 默认文件权限：666 (rw-rw-rw-)
# umask: 022
# 实际权限：644 (rw-r--r--)

# 默认目录权限：777 (rwxrwxrwx)
# umask: 022
# 实际权限：755 (rwxr-xr-x)
```

### 3. 进程管理工具

#### 3.1 PM2 - Node.js 进程管理器

**PM2 简介**

PM2 是一个流行的 Node.js 进程管理器，提供进程守护、负载均衡、日志管理等功能。

**安装 PM2**

```bash
# 使用 npm 全局安装
npm install -g pm2

# 或使用 yarn
yarn global add pm2
```

**基本命令**

**启动应用**

```bash
pm2 start app.js              # 启动应用
pm2 start app.js --name myapp # 指定应用名称
pm2 start npm --name app -- start  # 启动 npm 脚本
pm2 start ecosystem.config.js # 使用配置文件启动
```

**进程管理**

```bash
pm2 list                      # 列出所有进程
pm2 status                    # 显示进程状态
pm2 stop <app_name|id>        # 停止进程
pm2 restart <app_name|id>     # 重启进程
pm2 reload <app_name|id>       # 零停机重载
pm2 delete <app_name|id>      # 删除进程
pm2 delete all                # 删除所有进程
pm2 kill                      # 杀死 PM2 守护进程
```

**监控和日志**

```bash
pm2 monit                     # 实时监控
pm2 logs                      # 查看所有日志
pm2 logs <app_name>           # 查看指定应用日志
pm2 logs --lines 100          # 显示最近 100 行日志
pm2 flush                     # 清空所有日志
```

**信息查询**

```bash
pm2 show <app_name>           # 显示应用详细信息
pm2 describe <app_name>       # 显示应用配置
pm2 info <app_name>           # 显示应用信息
```

**启动管理**

```bash
pm2 startup                   # 生成启动脚本（系统启动时自动运行）
pm2 save                      # 保存当前进程列表
pm2 resurrect                 # 恢复保存的进程列表
pm2 unstartup                 # 移除启动脚本
```

**PM2 Ecosystem 配置文件**

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'myapp',
      script: './app.js',
      instances: 2,              // 启动 2 个实例（负载均衡）
      exec_mode: 'cluster',       // 集群模式
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,          // 自动重启
      watch: false,               // 是否监听文件变化
      max_memory_restart: '1G',   // 内存超过 1G 自动重启
      min_uptime: '10s',          // 最小运行时间
      max_restarts: 10            // 最大重启次数
    }
  ]
};
```

**启动配置**

```bash
pm2 start ecosystem.config.js           # 启动所有应用
pm2 start ecosystem.config.js --env production  # 使用生产环境配置
```

**高级功能**

```bash
# 集群模式
pm2 start app.js -i 4                   # 启动 4 个实例

# 负载均衡
pm2 start app.js -i max                # 使用所有 CPU 核心

# 环境变量
pm2 start app.js --env production

# 监听文件变化（开发环境）
pm2 start app.js --watch

# 限制内存
pm2 start app.js --max-memory-restart 1G
```

#### 3.2 systemd - 系统服务管理

**systemd 简介**

systemd 是 Linux 系统现代化的系统和服务管理器，用于管理系统的启动和服务。

**基本命令**

```bash
systemctl start service_name    # 启动服务
systemctl stop service_name     # 停止服务
systemctl restart service_name  # 重启服务
systemctl reload service_name   # 重载配置（不重启）
systemctl status service_name   # 查看服务状态
systemctl enable service_name   # 设置开机自启
systemctl disable service_name  # 取消开机自启
systemctl is-enabled service_name # 检查是否开机自启
systemctl list-units            # 列出所有单元
systemctl list-units --type=service  # 列出所有服务
```

**创建 systemd 服务单元**

创建服务文件 `/etc/systemd/system/myapp.service`：

```ini
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**服务配置说明**

- `[Unit]`：单元描述和依赖
- `Description`：服务描述
- `After`：在哪些服务之后启动
- `[Service]`：服务配置
- `Type`：服务类型（simple, forking, oneshot）
- `User`：运行用户
- `WorkingDirectory`：工作目录
- `ExecStart`：启动命令
- `Restart`：重启策略（always, on-failure, no）
- `Environment`：环境变量
- `[Install]`：安装配置
- `WantedBy`：目标单元

**管理服务**

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start myapp

# 查看状态
sudo systemctl status myapp

# 设置开机自启
sudo systemctl enable myapp

# 查看日志
sudo journalctl -u myapp
sudo journalctl -u myapp -f        # 实时查看日志
sudo journalctl -u myapp --since "1 hour ago"  # 查看最近 1 小时日志
```

**日志管理**

```bash
journalctl -u service_name         # 查看服务日志
journalctl -u service_name -f      # 实时查看日志
journalctl -u service_name --since today  # 查看今天的日志
journalctl -u service_name --since "2024-01-01" --until "2024-01-02"  # 指定时间范围
journalctl -u service_name -n 100  # 查看最近 100 条日志
```

**PM2 vs systemd**

| 特性 | PM2 | systemd |
|------|-----|---------|
| 用途 | Node.js 应用管理 | 系统服务管理 |
| 易用性 | 简单，专门为 Node.js 设计 | 通用，配置相对复杂 |
| 功能 | 进程守护、负载均衡、日志管理 | 系统服务管理、依赖管理 |
| 适用场景 | Node.js 应用开发和生产 | 系统服务、系统级应用 |
| 推荐场景 | Node.js 应用 | 系统服务、非 Node.js 应用 |

### 4. 防火墙配置

#### 4.1 iptables - Linux 防火墙

**iptables 简介**

iptables 是 Linux 系统内置的防火墙工具，用于配置数据包过滤规则。

**基本概念**

- **表（Tables）**：filter、nat、mangle、raw
- **链（Chains）**：INPUT、OUTPUT、FORWARD、PREROUTING、POSTROUTING
- **规则（Rules）**：匹配条件和动作

**常用命令**

```bash
# 查看规则
iptables -L                    # 列出所有规则
iptables -L -n                 # 以数字形式显示（不解析域名）
iptables -L -v                 # 显示详细信息
iptables -L INPUT -n --line-numbers  # 显示行号

# 清空规则
iptables -F                    # 清空所有规则
iptables -F INPUT              # 清空指定链的规则

# 设置默认策略
iptables -P INPUT DROP         # 设置 INPUT 链默认策略为 DROP
iptables -P OUTPUT ACCEPT      # 设置 OUTPUT 链默认策略为 ACCEPT
iptables -P FORWARD DROP       # 设置 FORWARD 链默认策略为 DROP
```

**添加规则**

```bash
# 允许特定端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT    # 允许 SSH（22 端口）
iptables -A INPUT -p tcp --dport 80 -j ACCEPT    # 允许 HTTP（80 端口）
iptables -A INPUT -p tcp --dport 443 -j ACCEPT   # 允许 HTTPS（443 端口）

# 允许特定 IP
iptables -A INPUT -s 192.168.1.100 -j ACCEPT     # 允许来自特定 IP
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT    # 允许来自特定网段

# 拒绝规则
iptables -A INPUT -p tcp --dport 8080 -j DROP     # 拒绝特定端口
iptables -A INPUT -s 192.168.1.200 -j DROP       # 拒绝特定 IP

# 允许回环接口
iptables -A INPUT -i lo -j ACCEPT                # 允许本地回环

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
```

**删除规则**

```bash
iptables -D INPUT 1            # 删除 INPUT 链的第 1 条规则
iptables -D INPUT -p tcp --dport 80 -j ACCEPT  # 删除特定规则
```

**保存规则**

```bash
# Ubuntu/Debian
iptables-save > /etc/iptables/rules.v4
iptables-restore < /etc/iptables/rules.v4

# CentOS/RHEL
service iptables save
# 或
iptables-save > /etc/sysconfig/iptables
```

**常用配置示例**

```bash
# 清空现有规则
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# 设置默认策略
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 允许回环接口
iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH（22 端口）
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTP 和 HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许特定 IP 访问（如管理后台）
iptables -A INPUT -p tcp -s 192.168.1.100 --dport 8080 -j ACCEPT

# 允许 Ping
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT

# 保存规则
iptables-save > /etc/iptables/rules.v4
```

#### 4.2 ufw - Ubuntu 防火墙（简化版）

**ufw 简介**

ufw（Uncomplicated Firewall）是 Ubuntu 上简化防火墙配置的工具，基于 iptables。

**基本命令**

```bash
# 查看状态
ufw status                    # 查看防火墙状态
ufw status verbose            # 查看详细状态
ufw status numbered           # 显示规则编号

# 启用/禁用
ufw enable                    # 启用防火墙
ufw disable                   # 禁用防火墙

# 默认策略
ufw default deny incoming     # 默认拒绝所有入站连接
ufw default allow outgoing    # 默认允许所有出站连接
ufw default deny forward      # 默认拒绝所有转发连接
```

**添加规则**

```bash
# 允许端口
ufw allow 22                  # 允许 SSH（22 端口）
ufw allow 80                  # 允许 HTTP（80 端口）
ufw allow 443                 # 允许 HTTPS（443 端口）
ufw allow 80/tcp              # 指定协议
ufw allow 3000:4000/tcp       # 允许端口范围

# 允许特定 IP
ufw allow from 192.168.1.100 # 允许来自特定 IP
ufw allow from 192.168.1.0/24 # 允许来自特定网段
ufw allow from 192.168.1.100 to any port 22  # 允许特定 IP 访问特定端口

# 拒绝规则
ufw deny 8080                 # 拒绝端口
ufw deny from 192.168.1.200   # 拒绝特定 IP

# 允许应用
ufw allow 'Nginx Full'        # 允许 Nginx（需要应用配置文件）
ufw allow 'Apache'            # 允许 Apache
```

**删除规则**

```bash
ufw delete allow 80           # 删除允许 80 端口的规则
ufw delete deny 8080          # 删除拒绝 8080 端口的规则
ufw delete 1                  # 删除编号为 1 的规则（需先查看编号）
```

**重置规则**

```bash
ufw reset                     # 重置所有规则（需要确认）
```

**常用配置示例**

```bash
# 设置默认策略
ufw default deny incoming
ufw default allow outgoing

# 允许常用端口
ufw allow 22                  # SSH
ufw allow 80                  # HTTP
ufw allow 443                 # HTTPS

# 允许特定服务
ufw allow 'Nginx Full'

# 启用防火墙
ufw enable

# 查看状态
ufw status verbose
```

**配置文件位置**

- `/etc/ufw/ufw.conf`：主配置文件
- `/etc/ufw/before.rules`：iptables 规则（在 ufw 规则之前）
- `/etc/ufw/after.rules`：iptables 规则（在 ufw 规则之后）
- `/etc/ufw/user.rules`：用户规则

**macOS 防火墙**

macOS 使用不同的防火墙工具：

```bash
# 启用防火墙
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on

# 查看状态
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# 允许特定应用
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /path/to/app
```

### 5. 用户和权限管理

#### 5.1 用户管理

**查看用户信息**

```bash
whoami                      # 当前用户名
id                          # 当前用户 ID 和组信息
id username                 # 查看指定用户信息
who                         # 当前登录用户
w                           # 当前登录用户和活动
```

**用户相关文件**

- `/etc/passwd`：用户账户信息
- `/etc/shadow`：用户密码信息（加密）
- `/etc/group`：组信息

**创建用户**

```bash
# 创建普通用户
sudo useradd -m username    # 创建用户并创建主目录
sudo useradd -m -s /bin/bash username  # 指定 shell

# 设置密码
sudo passwd username        # 设置用户密码

# 创建系统用户（无登录 shell）
sudo useradd -r -s /usr/sbin/nologin username
```

**修改用户**

```bash
# 修改用户信息
sudo usermod -s /bin/bash username    # 修改 shell
sudo usermod -d /new/home username    # 修改主目录
sudo usermod -g groupname username    # 修改主要组
sudo usermod -aG groupname username    # 添加到附加组
```

**删除用户**

```bash
sudo userdel username       # 删除用户（保留主目录）
sudo userdel -r username    # 删除用户和主目录
```

#### 5.2 组管理

**查看组信息**

```bash
groups                      # 当前用户所属组
groups username             # 指定用户所属组
getent group groupname      # 查看组详细信息
```

**创建组**

```bash
sudo groupadd groupname     # 创建组
```

**修改组**

```bash
sudo groupmod -n newname oldname  # 重命名组
```

**删除组**

```bash
sudo groupdel groupname     # 删除组（确保没有用户使用）
```

**添加用户到组**

```bash
sudo usermod -aG groupname username  # 添加到附加组
sudo gpasswd -a username groupname   # 另一种方式
```

**从组中移除用户**

```bash
sudo gpasswd -d username groupname   # 从组中移除用户
```

#### 5.3 sudo - 超级用户权限

**sudo 简介**

sudo 允许授权用户以其他用户（通常是 root）的身份执行命令。

**基本用法**

```bash
sudo command                # 以 root 权限执行命令
sudo -u username command    # 以指定用户身份执行
sudo -i                     # 切换到 root shell
sudo su -                   # 切换到 root 用户
sudo -s                     # 以 root 权限打开 shell
```

**sudoers 配置**

编辑 sudoers 文件（使用 `visudo`，不要直接编辑）：

```bash
sudo visudo                 # 安全编辑 sudoers 文件
```

**sudoers 配置示例**

```bash
# 允许用户执行所有命令
username ALL=(ALL) ALL

# 允许用户执行所有命令，无需密码
username ALL=(ALL) NOPASSWD: ALL

# 允许用户执行特定命令
username ALL=(ALL) /usr/bin/apt-get, /usr/bin/systemctl

# 允许用户组执行所有命令
%admin ALL=(ALL) ALL

# 允许用户以特定用户身份执行命令
username ALL=(www-data) /usr/bin/systemctl restart nginx
```

**sudoers 配置语法**

```
user host=(runas) command
```

- `user`：用户名或组（%groupname）
- `host`：主机名（ALL 表示所有主机）
- `runas`：以哪个用户身份运行（ALL 表示所有用户）
- `command`：允许执行的命令（ALL 表示所有命令）

**常用配置**

```bash
# 允许用户执行系统管理命令
username ALL=(ALL) /usr/bin/systemctl, /usr/bin/apt-get, /usr/bin/dpkg

# 允许用户重启服务
username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
username ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart myapp
```

#### 5.4 SSH 密钥认证

**SSH 密钥简介**

SSH 密钥认证比密码认证更安全，支持免密登录。

**生成 SSH 密钥对**

```bash
# 生成 RSA 密钥（2048 位）
ssh-keygen -t rsa -b 2048

# 生成更安全的 ED25519 密钥（推荐）
ssh-keygen -t ed25519

# 指定密钥文件名和邮箱
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/id_ed25519

# 生成过程中会提示：
# - 密钥保存位置（默认 ~/.ssh/id_rsa）
# - 密码短语（passphrase，可选但推荐）
```

**查看公钥**

```bash
cat ~/.ssh/id_rsa.pub       # 查看 RSA 公钥
cat ~/.ssh/id_ed25519.pub   # 查看 ED25519 公钥
```

**复制公钥到服务器**

**方法 1：使用 ssh-copy-id（推荐）**

```bash
ssh-copy-id username@server_ip
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@server_ip  # 指定密钥文件
```

**方法 2：手动复制**

```bash
# 在本地机器上
cat ~/.ssh/id_rsa.pub

# 在服务器上（以目标用户身份）
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**测试 SSH 密钥登录**

```bash
ssh username@server_ip      # 应该可以直接登录，无需密码
```

**配置 SSH 客户端**

编辑 `~/.ssh/config`：

```bash
Host myserver
    HostName server_ip
    User username
    IdentityFile ~/.ssh/id_ed25519
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

使用配置：

```bash
ssh myserver                 # 使用别名登录
```

**服务器端 SSH 配置**

编辑 `/etc/ssh/sshd_config`：

```bash
# 允许公钥认证
PubkeyAuthentication yes

# 禁止密码认证（可选，更安全）
PasswordAuthentication no

# 指定授权密钥文件位置
AuthorizedKeysFile .ssh/authorized_keys

# 禁用 root 登录（推荐）
PermitRootLogin no
```

重启 SSH 服务：

```bash
sudo systemctl restart sshd  # Ubuntu/Debian
sudo systemctl restart ssh   # 某些系统
```

**多密钥管理**

如果有多个 SSH 密钥：

```bash
# 在 ~/.ssh/config 中配置
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github

Host server1
    HostName 192.168.1.100
    User admin
    IdentityFile ~/.ssh/id_ed25519_server1
```

**SSH 密钥最佳实践**

1. 使用 ED25519 密钥（更安全、更快）
2. 设置密码短语（passphrase）
3. 定期轮换密钥
4. 服务器端禁用密码认证（仅允许密钥认证）
5. 使用 SSH 代理（ssh-agent）管理密钥
6. 不要共享私钥

**使用 ssh-agent**

```bash
# 启动 ssh-agent
eval "$(ssh-agent -s)"

# 添加密钥
ssh-add ~/.ssh/id_ed25519

# 查看已添加的密钥
ssh-add -l

# 删除所有密钥
ssh-add -D
```

## 实战任务

### 任务 1: Linux 基础命令练习

**目标**：熟练掌握 Linux 常用命令

**步骤**：

1. **文件操作练习**

```bash
# 创建练习目录
mkdir -p ~/linux_practice
cd ~/linux_practice

# 创建测试文件
echo "Hello World" > file1.txt
echo "Test Content" > file2.txt
mkdir test_dir

# 练习 ls 命令
ls -lah
ls -lht              # 按时间排序
ls -lhS              # 按大小排序

# 练习复制和移动
cp file1.txt file1_copy.txt
mv file2.txt test_dir/
cp -r test_dir test_dir_copy

# 练习查找
find . -name "*.txt"
find . -type f -size +1k

# 练习文本搜索
grep "Hello" file1.txt
grep -r "Test" .
```

2. **进程管理练习**

```bash
# 查看进程
ps aux | grep node
ps aux | head -20

# 启动一个测试进程
node -e "setInterval(() => console.log('running'), 1000)" &

# 查看进程
ps aux | grep node
top

# 终止进程
kill <PID>
```

3. **网络命令练习**

```bash
# 查看网络接口
ip addr
ifconfig              # 如果可用

# 查看监听端口
netstat -tuln
ss -tuln

# 测试网络连通性
ping -c 4 google.com
curl -I https://www.google.com

# DNS 查询
dig google.com
nslookup google.com
```

**预期结果**：

- 能够熟练使用文件操作命令
- 能够查看和管理进程
- 能够查看网络配置和测试连通性

### 任务 2: 文件权限管理实践

**目标**：掌握文件权限设置和管理

**步骤**：

1. **创建测试文件和目录**

```bash
mkdir -p ~/permission_test
cd ~/permission_test

# 创建文件
echo "test content" > test_file.txt
touch script.sh
chmod +x script.sh

# 创建目录
mkdir test_dir
```

2. **练习权限设置**

```bash
# 使用数字模式设置权限
chmod 755 test_file.txt
chmod 644 script.sh
chmod 700 test_dir

# 使用符号模式设置权限
chmod u+x script.sh
chmod g+w test_file.txt
chmod o-r test_file.txt

# 查看权限
ls -l
```

3. **权限验证**

```bash
# 测试文件权限
cat test_file.txt           # 应该有读权限
echo "new content" >> test_file.txt  # 测试写权限

# 测试执行权限
./script.sh                 # 应该可以执行

# 测试目录权限
cd test_dir                 # 应该可以进入
ls test_dir                 # 应该可以列出内容
```

**预期结果**：

- 理解文件权限的三种表示方式
- 能够使用 chmod 设置文件权限
- 能够验证权限是否生效

### 任务 3: PM2 进程守护配置

**目标**：使用 PM2 管理 Node.js 应用

**步骤**：

1. **安装 PM2**

```bash
npm install -g pm2
```

2. **创建测试应用**

创建 `test-app.js`：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello from PM2!\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

3. **使用 PM2 启动应用**

```bash
# 基本启动
pm2 start test-app.js

# 指定名称和实例数
pm2 start test-app.js --name myapp -i 2

# 查看状态
pm2 list
pm2 status
pm2 show myapp

# 查看日志
pm2 logs myapp
pm2 logs myapp --lines 50
```

4. **创建 PM2 配置文件**

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [{
    name: 'myapp',
    script: './test-app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M'
  }]
};
```

5. **使用配置文件启动**

```bash
# 创建日志目录
mkdir -p logs

# 使用配置文件启动
pm2 start ecosystem.config.js

# 使用生产环境配置
pm2 start ecosystem.config.js --env production
```

6. **PM2 管理操作**

```bash
# 重启应用
pm2 restart myapp

# 重载应用（零停机）
pm2 reload myapp

# 停止应用
pm2 stop myapp

# 删除应用
pm2 delete myapp

# 监控
pm2 monit

# 保存当前进程列表
pm2 save

# 设置开机自启
pm2 startup
pm2 save
```

**预期结果**：

- 能够使用 PM2 启动和管理 Node.js 应用
- 能够创建和使用 PM2 配置文件
- 能够配置进程守护和自动重启
- 能够查看日志和监控应用状态

### 任务 4: systemd 服务配置

**目标**：创建 systemd 服务单元

**步骤**：

1. **准备应用**

使用任务 3 中的 `test-app.js`，确保应用可以正常运行。

2. **创建 systemd 服务文件**

创建 `/etc/systemd/system/myapp.service`：

```bash
sudo nano /etc/systemd/system/myapp.service
```

内容：

```ini
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/test-app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

3. **准备应用目录**

```bash
# 创建应用目录
sudo mkdir -p /var/www/myapp

# 复制应用文件
sudo cp test-app.js /var/www/myapp/

# 设置权限
sudo chown -R www-data:www-data /var/www/myapp
```

4. **管理服务**

```bash
# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start myapp

# 查看状态
sudo systemctl status myapp

# 设置开机自启
sudo systemctl enable myapp

# 查看日志
sudo journalctl -u myapp
sudo journalctl -u myapp -f        # 实时查看
sudo journalctl -u myapp --since "1 hour ago"  # 最近 1 小时
```

5. **测试服务**

```bash
# 测试应用是否运行
curl http://localhost:3000

# 重启服务
sudo systemctl restart myapp

# 停止服务
sudo systemctl stop myapp

# 禁用开机自启
sudo systemctl disable myapp
```

**预期结果**：

- 能够创建 systemd 服务单元文件
- 能够使用 systemctl 管理服务
- 能够查看服务日志
- 能够配置服务开机自启

### 任务 5: 防火墙配置实践

**目标**：配置防火墙规则

**步骤**：

**如果使用 Ubuntu/Debian（ufw）**：

1. **查看当前状态**

```bash
sudo ufw status
sudo ufw status verbose
```

2. **配置默认策略**

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

3. **允许常用端口**

```bash
# 允许 SSH（重要：确保不会锁定自己）
sudo ufw allow 22

# 允许 HTTP 和 HTTPS
sudo ufw allow 80
sudo ufw allow 443

# 允许应用端口（如 Node.js 应用）
sudo ufw allow 3000
```

4. **启用防火墙**

```bash
sudo ufw enable
```

5. **验证配置**

```bash
sudo ufw status verbose
```

6. **测试连接**

```bash
# 从另一台机器测试端口是否开放
telnet server_ip 80
curl http://server_ip
```

**如果使用 CentOS/RHEL（iptables）**：

1. **查看当前规则**

```bash
sudo iptables -L -n -v
```

2. **配置规则**

```bash
# 清空现有规则
sudo iptables -F

# 设置默认策略
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# 允许回环接口
sudo iptables -A INPUT -i lo -j ACCEPT

# 允许已建立的连接
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 允许 SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 允许 HTTP 和 HTTPS
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# 允许应用端口
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# 允许 Ping
sudo iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT
```

3. **保存规则**

```bash
# Ubuntu/Debian
sudo iptables-save > /etc/iptables/rules.v4

# CentOS/RHEL
sudo service iptables save
# 或
sudo iptables-save > /etc/sysconfig/iptables
```

4. **验证配置**

```bash
sudo iptables -L -n -v
```

**预期结果**：

- 能够配置防火墙规则
- 能够允许和拒绝特定端口
- 能够保存防火墙配置
- 理解防火墙的基本工作原理

### 任务 6: SSH 密钥配置

**目标**：配置 SSH 密钥认证，实现免密登录

**步骤**：

1. **生成 SSH 密钥对**

```bash
# 生成 ED25519 密钥（推荐）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或生成 RSA 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 按提示操作：
# - 选择保存位置（默认 ~/.ssh/id_ed25519）
# - 设置密码短语（passphrase，可选但推荐）
```

2. **查看公钥**

```bash
cat ~/.ssh/id_ed25519.pub
# 或
cat ~/.ssh/id_rsa.pub
```

3. **复制公钥到服务器**

**方法 1：使用 ssh-copy-id**

```bash
ssh-copy-id username@server_ip
# 或指定密钥文件
ssh-copy-id -i ~/.ssh/id_ed25519.pub username@server_ip
```

**方法 2：手动复制**

```bash
# 在本地机器上查看公钥
cat ~/.ssh/id_ed25519.pub

# 在服务器上（以目标用户身份）
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# 粘贴公钥内容，保存退出

# 设置权限
chmod 600 ~/.ssh/authorized_keys
```

4. **测试 SSH 密钥登录**

```bash
# 测试连接（应该不需要输入密码）
ssh username@server_ip

# 如果配置了 SSH config，使用别名
ssh myserver
```

5. **配置 SSH 客户端（可选）**

编辑 `~/.ssh/config`：

```bash
Host myserver
    HostName server_ip
    User username
    IdentityFile ~/.ssh/id_ed25519
    Port 22
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

6. **服务器端配置（可选，提高安全性）**

编辑 `/etc/ssh/sshd_config`：

```bash
sudo nano /etc/ssh/sshd_config
```

修改配置：

```bash
# 允许公钥认证
PubkeyAuthentication yes

# 禁止密码认证（可选，更安全）
PasswordAuthentication no

# 禁用 root 登录（推荐）
PermitRootLogin no
```

重启 SSH 服务：

```bash
sudo systemctl restart sshd
```

**预期结果**：

- 能够生成 SSH 密钥对
- 能够配置 SSH 密钥认证
- 能够实现免密登录
- 理解 SSH 密钥认证的安全优势

## 常见问题和解决方案

**问题 1: 权限被拒绝（Permission denied）**

- **症状**: 执行命令或访问文件时提示权限被拒绝
- **原因**: 文件权限不足或所有者不正确
- **解决**:
  ```bash
  # 检查文件权限
  ls -l filename
  
  # 修改文件权限
  chmod 755 filename
  
  # 修改文件所有者
  sudo chown username:group filename
  
  # 检查当前用户权限
  whoami
  id
  ```

**问题 2: PM2 进程频繁重启**

- **症状**: PM2 进程不断重启
- **原因**: 应用崩溃、内存超限、配置错误
- **解决**:
  ```bash
  # 查看日志
  pm2 logs myapp
  
  # 查看详细信息
  pm2 show myapp
  
  # 检查内存限制
  pm2 show myapp | grep memory
  
  # 增加内存限制
  pm2 start ecosystem.config.js --update-env --max-memory-restart 1G
  ```

**问题 3: systemd 服务启动失败**

- **症状**: `systemctl status myapp` 显示 failed
- **原因**: 配置错误、路径错误、权限问题
- **解决**:
  ```bash
  # 查看详细错误信息
  sudo journalctl -u myapp -n 50
  
  # 检查服务文件语法
  sudo systemd-analyze verify /etc/systemd/system/myapp.service
  
  # 检查路径和权限
  sudo ls -l /var/www/myapp
  sudo cat /var/www/myapp/test-app.js
  
  # 测试命令是否能手动执行
  sudo -u www-data /usr/bin/node /var/www/myapp/test-app.js
  ```

**问题 4: 防火墙规则不生效**

- **症状**: 配置了防火墙规则但连接仍然被拒绝
- **原因**: 规则顺序错误、默认策略过于严格、规则未保存
- **解决**:
  ```bash
  # 检查规则顺序（iptables）
  sudo iptables -L -n --line-numbers
  
  # 检查默认策略
  sudo iptables -L | grep Policy
  
  # 确保允许已建立的连接
  sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
  
  # 保存规则
  sudo iptables-save > /etc/iptables/rules.v4
  ```

**问题 5: SSH 密钥登录失败**

- **症状**: 配置了 SSH 密钥但仍需要输入密码
- **原因**: 权限设置错误、公钥格式错误、服务器配置问题
- **解决**:
  ```bash
  # 检查文件权限（服务器端）
  ls -la ~/.ssh
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  
  # 检查公钥格式
  cat ~/.ssh/authorized_keys
  
  # 检查服务器 SSH 配置
  sudo grep PubkeyAuthentication /etc/ssh/sshd_config
  
  # 查看 SSH 日志（服务器端）
  sudo tail -f /var/log/auth.log
  ```

**问题 6: 命令找不到（command not found）**

- **症状**: 执行命令提示找不到
- **原因**: 命令未安装、PATH 环境变量未设置
- **解决**:
  ```bash
  # 检查命令是否存在
  which command_name
  
  # 检查 PATH 环境变量
  echo $PATH
  
  # 使用完整路径
  /usr/bin/command_name
  
  # 安装缺失的命令
  sudo apt-get install package_name  # Ubuntu/Debian
  sudo yum install package_name      # CentOS/RHEL
  ```

**问题 7: 磁盘空间不足**

- **症状**: 无法创建文件或写入数据
- **原因**: 磁盘空间已满
- **解决**:
  ```bash
  # 检查磁盘使用情况
  df -h
  
  # 查找大文件
  du -h --max-depth=1 / | sort -hr | head -20
  
  # 查找大于 100MB 的文件
  find / -type f -size +100M -exec ls -lh {} \;
  
  # 清理日志文件
  sudo journalctl --vacuum-time=7d  # 清理 7 天前的日志
  ```

## 学习检查清单

完成以下检查项，确保掌握 Day 5 内容：

- [ ] 能够熟练使用 Linux 常用命令进行文件操作、进程管理和网络配置
- [ ] 理解 Linux 文件权限系统（rwx、数字模式、符号模式）
- [ ] 能够使用 chmod 和 chown 管理文件权限
- [ ] 理解进程管理的重要性
- [ ] 能够使用 PM2 管理 Node.js 应用，包括启动、停止、重启、监控
- [ ] 能够创建和使用 PM2 配置文件（ecosystem.config.js）
- [ ] 能够创建 systemd 服务单元文件
- [ ] 能够使用 systemctl 管理服务（启动、停止、重启、查看状态）
- [ ] 能够查看 systemd 服务日志（journalctl）
- [ ] 理解防火墙的工作原理
- [ ] 能够使用 ufw 配置防火墙规则（Ubuntu/Debian）
- [ ] 能够使用 iptables 配置防火墙规则（CentOS/RHEL）
- [ ] 理解用户和权限管理的重要性
- [ ] 能够创建和管理用户和组
- [ ] 理解 sudo 的工作原理和配置方法
- [ ] 能够生成 SSH 密钥对
- [ ] 能够配置 SSH 密钥认证，实现免密登录
- [ ] 完成了所有 6 个实战任务
- [ ] 记录了学习笔记和遇到的问题
- [ ] 总结了 Linux 服务器基础运维的最佳实践

## 参考资源

- [Linux 命令大全](https://www.runoob.com/linux/linux-command-manual.html)
- [Linux 文件权限详解](https://www.linux.com/training-tutorials/understanding-linux-file-permissions/)
- [PM2 官方文档](https://pm2.keymetrics.io/)
- [systemd 官方文档](https://www.freedesktop.org/software/systemd/man/systemd.service.html)
- [iptables 教程](https://www.howtogeek.com/177621/the-beginners-guide-to-iptables-the-linux-firewall/)
- [ufw 官方文档](https://help.ubuntu.com/community/UFW)
- [SSH 密钥认证指南](https://www.ssh.com/academy/ssh/key)
- [Linux 用户和权限管理](https://www.linux.com/training-tutorials/working-linux-users-and-groups/)

## 学习时间分配建议

- **理论学习**: 2-3 小时
  - Linux 常用命令: 1 小时
  - 文件权限管理: 30 分钟
  - 进程管理工具: 40 分钟
  - 防火墙配置: 30 分钟
  - 用户和权限管理: 30 分钟

- **实践操作**: 3-4 小时
  - Linux 命令练习: 40 分钟
  - 文件权限管理实践: 30 分钟
  - PM2 配置: 50 分钟
  - systemd 配置: 50 分钟
  - 防火墙配置: 40 分钟
  - SSH 密钥配置: 30 分钟

- **总结笔记**: 30 分钟
  - 记录关键命令和配置
  - 记录遇到的问题和解决方案
  - 总结最佳实践和常用配置模板

## 实战练习建议

1. **准备测试环境**
   - 使用虚拟机或云服务器（Ubuntu 或 CentOS）
   - 确保有 root 或 sudo 权限
   - 准备一个简单的 Node.js 应用用于测试

2. **按照任务顺序实践**
   - 先完成 Linux 命令练习，熟悉基本操作
   - 然后练习文件权限管理
   - 接着配置进程管理工具（PM2 和 systemd）
   - 再配置防火墙规则
   - 最后配置 SSH 密钥认证

3. **注意安全性**
   - 配置防火墙时，确保不会锁定 SSH 连接
   - 修改 SSH 配置前，保留一个可以访问的会话
   - 测试配置时要谨慎，避免影响系统稳定性

4. **记录实践过程**
   - 记录每个命令的作用和参数
   - 记录配置文件的关键设置
   - 记录遇到的问题和解决方案
   - 记录性能测试结果

5. **总结最佳实践**
   - 整理常用的 Linux 命令清单
   - 整理 PM2 和 systemd 配置模板
   - 整理防火墙配置模板
   - 形成自己的服务器运维规范

