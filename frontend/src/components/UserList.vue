<template>
  <div>
    <el-input v-model="keyword" placeholder="Search users..." @input="searchUsers" style="margin-bottom: 20px;"></el-input>
    <el-table :data="paginatedUsers" style="width: 100%;">
      <el-table-column prop="username" label="Username">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.isEditing"
            v-model="scope.row.username"
            placeholder="Edit username"
          ></el-input>
          <span v-else>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Email">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.isEditing"
            v-model="scope.row.email"
            placeholder="Edit email"
          ></el-input>
          <span v-else>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isEditing"
            @click="editUser(scope.row)"
          >Edit</el-button>
          <el-button
            v-if="scope.row.isEditing"
            @click="saveUser(scope.row)"
          >Save</el-button>
          <el-button
            v-if="scope.row.isEditing"
            @click="cancelEdit(scope.row)"
            type="warning"
          >Cancel</el-button>
          <el-button
            @click="deleteUser(scope.row.id)"
            type="danger"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-button
        type="primary"
        @click="showAddUserForm"
        class="add-user-button"
      >Add User</el-button>
      <el-dialog :visible.sync="isAddUserDialogVisible" class="add-user-dialog">
        <div class="dialog-header">
          <span class="dialog-title">Add New User</span>
        </div>
        <el-form :model="newUser" label-width="120px">
          <el-form-item label="Username">
            <el-input v-model="newUser.username"></el-input>
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="newUser.email"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isAddUserDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addUser">Add</el-button>
        </div>
      </el-dialog>
      <el-pagination
        @current-change="handlePageChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalUsers"
        layout="prev, pager, next, jumper"
        style="margin-top: 20px;"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  data() {
    return {
      users: [],
      keyword: '',
      isAddUserDialogVisible: false,
      newUser: {
        username: '',
        email: ''
      },
      currentPage: 1,
      pageSize: 10,
      totalUsers: 0
    };
  },
  computed: {
    filteredUsers() {
      if (this.keyword) {
        return this.users.filter(user =>
          user.username.toLowerCase().includes(this.keyword.toLowerCase())
        );
      }
      return this.users;
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredUsers.slice(start, end);
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (response.ok) {
          const data = await response.json();
          this.users = data;
          this.totalUsers = data.length; // Set total number of users
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async searchUsers() {
      try {
        const response = await fetch(`http://localhost:8080/api/users?keyword=${this.keyword}`);
        if (response.ok) {
          const data = await response.json();
          this.users = data;
          this.totalUsers = data.length; // Update total number of users
        } else {
          console.error('Failed to search users');
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    },
    editUser(user) {
      Vue.set(user, 'isEditing', true);
      Vue.set(user, 'originalData', { ...user });
    },
    async saveUser(user) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            email: user.email
          })
        });
        if (response.ok) {
          const updatedUser = await response.json();
          Object.assign(user, updatedUser);
          Vue.set(user, 'isEditing', false);
        } else {
          console.error('Failed to save user');
        }
      } catch (error) {
        console.error('Error saving user:', error);
      }
    },
    cancelEdit(user) {
      Object.assign(user, user.originalData);
      Vue.set(user, 'isEditing', false);
    },
    async deleteUser(id) {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          this.users = this.users.filter(user => user.id !== id);
          this.totalUsers = this.totalUsers - 1; // Update total number of users
        } else {
          console.error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    showAddUserForm() {
      this.isAddUserDialogVisible = true;
    },
    async addUser() {
      try {
        const response = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.newUser)
        });
        if (response.ok) {
          const newUser = await response.json();
          this.users.push(newUser);
          this.newUser = { username: '', email: '' };
          this.isAddUserDialogVisible = false;
          this.totalUsers = this.totalUsers + 1; // Update total number of users
        } else {
          console.error('Failed to add user');
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    },
    handlePageChange(page) {
      this.currentPage = page;
    }
  },
  mounted() {
    this.fetchUsers();
  }
}
</script>

<style scoped>
.add-user-button {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.add-user-dialog .el-dialog__header {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.dialog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-title {
  font-size: 18px;
  font-weight: bold;
}
</style>
