<template>
  <el-table :data="projectData">
    <el-table-column prop="project_id" label="项目 ID"></el-table-column>
    <el-table-column prop="java_path" label="Java 路径"></el-table-column>
    <el-table-column label="Jar 目录">
      <template #default="scope">
        <el-text>{{ scope.row.jar_path }}</el-text>
        <el-select v-model="jar" placeholder="jar 包" style="width: 100px" size="small">
          <el-option v-for="(item, index) in scope.row.jars" :key="index" :label="item" :value="item">
            {{ item }}
          </el-option>
        </el-select>
        <el-upload
            action="/api/file"
            :data="{ project_type: 'java', project_id: scope.row.project_id }"
            :limit="1"
            :show-file-list="false"
            style="display: inline-block"
        >
          <template #trigger>
            <el-button size="small">上</el-button>
          </template>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column label="配置">
      <template #default="scope">
        <div v-for="(v, k, index) in scope.row.config" :key="index">
          {{ k }}: {{ v }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="属性">
      <template #default="scope">
        <div v-for="(v, k, index) in scope.row.properties" :key="index">
          {{ k }}: {{ v }}
        </div>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 0" type="primary" @click="showException(scope.row.exception)">未启动</el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">运行中</el-tag>
        <el-tag v-else-if="scope.row.status === 2" type="warning">已停止</el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="danger" @click="showException(scope.row.exception)">异常退出</el-tag>
        <el-tag v-else type="info">未知状态</el-tag>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button v-if="scope.row.status === 1" type="danger" size="small">停止</el-button>
        <el-button v-else type="success" size="small">启动</el-button>
        <el-button type="primary" size="small" @click="editItem(scope.row.project_id)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="showJavaProjectForm" title="编辑 java {{editId}} 项目">
    <JavaProjectForm :project_id="editId" @close="showJavaProjectForm = false" />
  </el-dialog>
</template>

<script setup>
import {ElMessageBox} from "element-plus";
import JavaProjectForm from "@/components/JavaProjectForm.vue";
import {ref} from "vue";

const props = defineProps({
  projectData: {
    type: Array,
    default: []
  }
})

const showJavaProjectForm = ref(false)
const editId = ref("")
const jar = ref("")

const showException = (e) => {
  ElMessageBox.alert('异常详情', e, {
    confirmButtonText: '确定',
    type: 'error'
  })
}

const editItem = (project_id) => {
  editId.value = project_id
  showJavaProjectForm.value = true
}

</script>

<style scoped>

</style>
