<template>
  <el-table :data="projectData">
    <el-table-column prop="project_id" label="项目 ID"></el-table-column>
    <el-table-column prop="java_path" label="Java 路径"></el-table-column>
    <el-table-column label="Jar 目录">
      <template #default="scope">
        <el-text>{{ scope.row.jar_path }}</el-text>
        <el-select v-model="jarIdx" placeholder="jar 包" style="width: 100px" size="small">
          <el-option v-for="(item, index) in scope.row.jars" :key="index" :label="item" :value="index">
            {{ item }}
          </el-option>
        </el-select>
        <el-upload
            action="/api/file"
            :data="{ project_type: 'java', project_id: scope.row.project_id }"
            :on-success="()=>ElMessage.success('上传成功')"
            :on-error="()=>ElMessage.error('上传失败')"
            :limit="1"
            :show-file-list="false"
            style="display: inline-block; margin-left: 10px;"
        >
          <template #trigger>
            <el-icon><Upload /></el-icon>
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
        <el-tag v-if="scope.row.status === 0" type="primary">未启动</el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">运行中</el-tag>
        <el-tag v-else-if="scope.row.status === 2" type="warning">已停止</el-tag>
        <el-tag v-else-if="scope.row.status === 3" type="danger" @click="showException(scope.row.exception)">异常退出</el-tag>
        <el-tag v-else type="info">未知状态</el-tag>
      </template>
    </el-table-column>
    <el-table-column>
      <template #default="scope">
        <el-button v-if="scope.row.status === 1" type="danger" size="small" @click="stopJavaProject(scope.row.project_id)">停止</el-button>
        <el-button v-else type="success" size="small" @click="runJavaProject(scope.row.project_id)" :disabled="scope.row.jars.length === 0">启动</el-button>
        <el-button type="primary" size="small" @click="editItem(scope.row.project_id)">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteItem(scope.row.project_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog destroy-on-close v-model="showJavaProjectForm">
    <template #header>
      <span>编辑 java 项目 {{editId}}</span>
    </template>
    <JavaProjectForm :project_id="editId" @close="showJavaProjectForm = false" />
  </el-dialog>
</template>

<script setup>
import {ElMessage, ElMessageBox} from "element-plus";
import JavaProjectForm from "@/components/form/JavaProjectForm.vue";
import {ref} from "vue";
import {Upload} from "@element-plus/icons-vue";
import {delete_project, run_project, stop_project} from "@/js/api.js";

const props = defineProps({
  projectData: {
    type: Array,
    default: []
  }
})

const emit = defineEmits(['get-project-data'])

const showJavaProjectForm = ref(false)
const editId = ref("")
const jarIdx = ref()

const showException = (e) => {
  ElMessageBox.alert('异常详情', e, {
    confirmButtonText: '确定',
    type: 'error'
  })
}

const runJavaProject = (project_id) => {
  console.log(project_id)
  console.log(jarIdx.value)
  if (jarIdx.value === undefined) {
    ElMessage.error("请选择 jar 包")
    return
  }
  run_project("java", project_id, jarIdx.value).then(res => {
    if (res.code === 200) {
      ElMessage.success("启动成功")
    } else {
      ElMessage.error("启动失败")
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error("启动失败")
  })
}

const stopJavaProject = (project_id) => {
  stop_project("java", project_id).then(res => {
    if (res.data.code === 200) {
      ElMessage.success("停止成功")
    } else {
      ElMessage.error("停止失败")
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error("停止失败")
  })
}

const editItem = (project_id) => {
  editId.value = project_id
  showJavaProjectForm.value = true
  emit('get-project-data')
}

const deleteItem = (project_id) => {
  ElMessageBox.confirm('确认删除该项目吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log(project_id)
    delete_project("java", project_id).then(res => {
      if (res.code === 200) {
        ElMessage.success("删除成功")
      } else {
        ElMessage.error("删除失败")
      }
    }).catch(err => {
      console.log(err)
      ElMessage.error("删除失败")
    })
  })
}

</script>

<style scoped>

</style>
