<template>
  <el-form :model="projectForm" label-width="auto">
    <el-form-item label="Project Name" prop="project_name">
      <el-input v-model="projectForm.project_name"></el-input>
    </el-form-item>
    <el-form-item label="Zip Path" prop="zip_path">
      <el-input v-model="projectForm.zip_path"></el-input>
    </el-form-item>
    <el-form-item label="解压缩路径" prop="dist_path">
      <el-input v-model="projectForm.dist_path"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {defineEmits, onMounted, reactive} from 'vue'
import {add_project, get_project, update_project} from "@/js/api.js";
import {ElMessage} from "element-plus";

const props = defineProps({
  project_id: {
    type: String,
    default: ""
  }
})

const emit = defineEmits(['close']);

const projectForm = reactive({
  project_name: "",
  zip_path: "",
  dist_path: ""
})

const onSubmit = () => {
  // 通过表单构建 project 对象
  console.log(projectForm)
  const project = {
    project_name: projectForm.project_name,
    zip_path: projectForm.zip_path,
    dist_path: projectForm.dist_path,
  }
  if (props.project_id) {
    // update project
    update_project("web", props.project_id, project).then(res => {
      ElMessage.success("更新成功")
      emit("close")
    })
  } else {
    // create project
    add_project("web", project).then(res => {
      ElMessage.success("创建成功")
      emit("close")
    })
  }
}

const onCancel = () => {
  emit("close")
}

onMounted(() => {
  if (props.project_id !== "") {
    // get project
    get_project("web", props.project_id).then(res => {
      // 通过 project 对象填充表单
      projectForm.project_name = res.data.project_name
      projectForm.zip_path = res.data.zip_path
      projectForm.dist_path = res.data.dist_path
    })
  } else {
    projectForm.project_name = ""
    projectForm.zip_path = ""
    projectForm.dist_path = ""
  }
})

</script>

<style>

</style>
