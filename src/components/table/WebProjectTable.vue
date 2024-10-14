<template>
  <el-table :data="projectData">
    <el-table-column prop="project_id" label="项目 ID"></el-table-column>
    <el-table-column prop="project_name" label="项目名称"></el-table-column>
    <el-table-column label="zip 目录">
      <template #default="scope">
        <el-text>{{ scope.row.zip_path }}</el-text>
        <el-select v-model="zipIdx" placeholder="zip" style="width: 100px" size="small">
          <el-option v-for="(item, index) in scope.row.zips" :key="index" :label="item" :value="index">
            {{ item }}
          </el-option>
        </el-select>
        <el-upload
            action="/api/file"
            :data="{ project_type: 'web', project_id: scope.row.project_id }"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :limit="1"
            :show-file-list="true"
            style="display: inline-block; margin-left: 10px;"
        >
          <template #trigger>
            <el-icon><Upload /></el-icon>
          </template>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column prop="dist_path" label="解压缩路径"></el-table-column>
    <el-table-column label="后置脚本">
      <template #default="scope">
        <el-popover v-if="scope.row.after_script !== ''" placement="bottom" title="shell" width="300" trigger="click">
          <template #reference>
            <el-text>点击查看</el-text>
          </template>
          <template #default>
            <el-text style="white-space: pre-wrap;">{{scope.row.after_script}}</el-text>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column label="状态" fixed="right">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 0" type="primary">未部署</el-tag>
        <el-tag v-else-if="scope.row.status === 1" type="success">已部署</el-tag>
        <el-tag v-else type="info">未知状态</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" min-width="120">
      <template #default="scope">
        <el-button v-if="scope.row.status === 1" type="danger" size="small" @click="undeployWebProject(scope.row.project_id)">停止</el-button>
        <el-button v-else type="success" size="small" @click="deployWebProject(scope.row.project_id)" :disabled="scope.row.zips.length === 0">部署</el-button>
        <el-button type="primary" size="small" @click="editItem(scope.row.project_id)">编辑</el-button>
        <el-button type="danger" size="small" @click="deleteItem(scope.row.project_id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog destroy-on-close v-model="showWebProjectForm">
    <template #header>
      <span>编辑 web 项目 {{editId}}</span>
    </template>
    <WebProjectForm :project_id="editId" @close="showWebProjectForm = false" />
  </el-dialog>
</template>

<script setup>
import {ElMessage, ElMessageBox} from "element-plus";
import WebProjectForm from "@/components/form/WebProjectForm.vue";
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

const showWebProjectForm = ref(false)
const editId = ref("")
const zipIdx = ref()

const handleUploadSuccess = (response, file, fileList) => {
  const i = fileList.indexOf(file)
  if (i !== -1) {
    fileList.splice(i, 1)
  }
  ElMessage.success('上传成功')
}

const handleUploadError = (err, file, fileList) => {
  ElMessage.error('上传失败')
}

const deployWebProject = (project_id) => {
  console.log(project_id)
  console.log(zipIdx.value)
  if (zipIdx.value === undefined) {
    ElMessage.error("请选择 zip 包")
    return
  }
  run_project("web", project_id, zipIdx.value).then(res => {
    if (res.code === 200) {
      ElMessage.success("部署成功")
    } else {
      ElMessage.error("部署失败")
    }
  }).catch(err => {
    console.log(err)
    ElMessage.error("部署失败")
  })
}

const undeployWebProject = (project_id) => {
  stop_project("web", project_id).then(res => {
    if (res.code === 200) {
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
  showWebProjectForm.value = true
  emit('get-project-data')
}

const deleteItem = (project_id) => {
  ElMessageBox.confirm('确认删除该项目吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log(project_id)
    delete_project("web", project_id).then(res => {
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
