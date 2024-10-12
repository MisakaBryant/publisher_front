<template>
  <el-container class="layout-container-demo" style="height: 500px">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1']" :default-active="'1-0'">
          <el-menu-item index="logo">
            <el-text>Job Manager 🛠️</el-text>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><Menu /></el-icon>项目类型
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="(item, index) in projectType" :key="item" :index="'1-'+index.toString()" @click="listProject(item)">{{ item }}</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header>
        <el-row :gutter="20" style="display: flex; align-content: center; height: 100%">
          <el-col :span="8">
            <div>
              <el-text type="info">CPU 使用情况</el-text>
              <el-progress :percentage="cpuInfo.value && cpuInfo.value.cpu_percent" :color="percentColors" :stroke-width="8">
              </el-progress>
            </div>
            <div class="sys_info">
              <el-tag size="large" type="success">
                CPU: {{ cpuInfo.value && cpuInfo.value.cpu_count.toString() + "C / " + cpuInfo.value.logic_cpu_count.toString() + "T" }}
              </el-tag>
              <el-tag size="large" type="info">
                Mem: {{ memInfo.value && memInfo.value.total.toString() }}
              </el-tag>
              <el-tag size="large" type="warning">
                Disk: {{ diskInfo.value && diskInfo.value.total.toString() }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="14">
            <div>
              <el-text type="info">内存使用情况</el-text>
              <el-progress :percentage="memInfo.value && memInfo.value.percent" :color="percentColors" :stroke-width="8">
              </el-progress>
            </div>
            <div>
              <el-text type="info">磁盘使用情况</el-text>
              <el-progress :percentage="diskInfo.value && diskInfo.value.percent" :color="percentColors" :stroke-width="8">
              </el-progress>
            </div>
          </el-col>
          <el-col :span="2" style="display: flex; align-items: center; justify-content: center;">
            <el-button round @click="addProject" size="large">
              <el-icon><plus /></el-icon>💼
            </el-button>
          </el-col>
        </el-row>
      </el-header>

      <el-main>
        <el-scrollbar always>
          <JavaProjectTable v-if="type==='java'" :project-data="projectData" />
          <WebProjectTable v-else-if="type==='web'" :project-data="projectData" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="showJavaProjectForm" title="新建 java 项目">
    <JavaProjectForm @close="showJavaProjectForm = false" />
  </el-dialog>
  <el-dialog v-model="showWebProjectForm" title="新建 web 项目">
    <WebProjectForm @close="showWebProjectForm = false" />
  </el-dialog>


</template>

<script setup>
import {reactive, ref} from 'vue'
import { Menu, Plus } from '@element-plus/icons-vue'
import {get_sys_info, list_project} from "@/js/api.js";
import JavaProjectForm from "@/components/form/JavaProjectForm.vue";
import JavaProjectTable from "@/components/table/JavaProjectTable.vue";
import WebProjectTable from "@/components/table/WebProjectTable.vue";
import WebProjectForm from "@/components/form/WebProjectForm.vue";

const projectType = ref(["java", "web"])
const type = ref("")
const projectData = ref([])
const showJavaProjectForm = ref(false)
const showWebProjectForm = ref(false)
const cpuInfo = reactive({})
const memInfo = reactive({})
const diskInfo = reactive({})

const percentColors = [
  { color: '#67C23A', percentage: 50 },
  { color: '#E6A23C', percentage: 90 },
  { color: '#F56C6C', percentage: 100 },
]

const listProject = async (t) => {
  if (t === "") {
    return
  }
  type.value = t
  const res = await list_project(t)
  projectData.value = res.data
  console.log(projectData.value)
}

const getSysInfo = () => {
  get_sys_info().then(res => {
    cpuInfo.value = res.data.cpu_info
    memInfo.value = res.data.mem_info
    diskInfo.value = res.data.disk_info
  }).catch(err => {
    console.log(err)
  })
}

const addProject = () => {
  if (type.value === "java") {
    showJavaProjectForm.value = true
  } else if (type.value === "web") {
    showWebProjectForm.value = true
  }
}

listProject("java")

const interval = setInterval(() => {
  listProject(type.value)
  getSysInfo()
}, 2000)

</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  height: 16%;
  /*
  background-color: var(--el-color-primary-light-9);
  */
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  /*
  background: var(--el-color-primary-light-9);
  */
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  height: 100%;
}
.sys_info .el-tag {
  margin-top: 5px;
  margin-right: 5%;
}
</style>
