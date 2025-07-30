<script setup>
import { ref, onMounted } from 'vue';
import UserService from '@/services/UserService';
import { BModal, BButton } from 'bootstrap-vue-next';

const conversations = ref([]);
const selectedConversation = ref(null);
const replyContent = ref('');
const conversationModal = ref(null);

const fetchConversations = async () => {
  try {
    const response = await UserService.getConversations();
    conversations.value = response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
  }
};

const viewConversation = async (conversation) => {
  try {
    const response = await UserService.getConversationDetails(conversation.id);
    selectedConversation.value = response.data;
    conversationModal.value.show();
  } catch (error) {
    console.error('Error fetching conversation details:', error);
  }
};

const sendReply = async () => {
  if (!replyContent.value.trim()) return;
  try {
    await UserService.replyToConversation(selectedConversation.value.id, replyContent.value);
    replyContent.value = '';
    await viewConversation(selectedConversation.value);
    await fetchConversations();
  } catch (error) {
    console.error('Error sending reply:', error);
  }
};

onMounted(() => {
  fetchConversations();
});
</script>
<template>
  <main class="content">
    <div class="container-fluid p-0">
      
      <h1 class="h3 mb-3">My Messages</h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Conversations</h5>
            </div>
            <div class="card-body table-responsive p-0">
              <table class="table table-hover text-nowrap">
                <thead>
                  <tr>
                    <th>Deal</th>
                    <th>With</th>
                    <th>Last Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="convo in conversations" :key="convo.id">
                    <td>{{ convo.listing ? convo.listing.title : 'N/A' }}</td>
                    <td>{{ convo.participant.displayName }}</td>
                    <td>{{ new Date(convo.lastMessageAt).toLocaleString() }}</td>
                    <td>
                      <BButton variant="info" size="sm" @click="viewConversation(convo)">View</BButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversation Modal -->
      <BModal ref="conversationModal" title="Conversation Details" size="lg" no-footer no-close-on-backdrop>
        <div v-if="selectedConversation">
          <ul class="list-unstyled">
            <li v-for="message in selectedConversation.messages" :key="message.id" class="media mb-2">
              <div class="media-body">
                <div class="d-flex justify-content-between">
                  <strong>{{ message.sender.displayName || message.sender.email }}</strong>
                  <small>{{ new Date(message.createdAt).toLocaleString() }}</small>
                </div>
                <p>{{ message.content }}</p>
              </div>
            </li>
          </ul>
        </div>
        <form @submit.prevent="sendReply" class="w-100 mt-3">
          <div class="input-group">
            <input type="text" class="form-control" placeholder="Type a message" v-model="replyContent">
            <div class="input-group-append">
              <BButton variant="primary" type="submit">Send</BButton>
            </div>
          </div>
        </form>
      </BModal>
    </div>
  </main>
</template>
<style scoped>
</style>