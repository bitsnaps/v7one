<script setup>
import { ref, onMounted, reactive } from 'vue';
import AdminService from '@/services/AdminService';
import { BModal, BButton } from 'bootstrap-vue-next';

const conversations = ref([]);
const selectedConversation = ref(null);
const replyContent = ref('');
const users = ref([]);
const listings = ref([]);
const conversationForm = reactive({
  userOneId: '',
  userTwoId: '',
  listingId: '',
  content: '',
});

const conversationModal = ref(null);
const createConversationModal = ref(null);

const fetchConversations = async () => {
  try {
    const response = await AdminService.getConversations();
    conversations.value = response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
  }
};

const viewConversation = async (conversation) => {
  try {
    const response = await AdminService.getConversationDetails(conversation.id);
    selectedConversation.value = response.data;
    conversationModal.value.show();
  } catch (error) {
    console.error('Error fetching conversation details:', error);
  }
};

const deleteConversation = async (id) => {
  if (confirm('Are you sure you want to delete this conversation?')) {
    try {
      await AdminService.deleteConversation(id);
      fetchConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  }
};

const sendReply = async () => {
  if (!replyContent.value.trim()) return;
  try {
    await AdminService.replyToConversation(selectedConversation.value.id, replyContent.value);
    replyContent.value = '';
    await viewConversation(selectedConversation.value);
    await fetchConversations();
  } catch (error) {
    console.error('Error sending reply:', error);
  }
};

const openConversationModal = async () => {
  try {
    const [usersResponse, listingsResponse] = await Promise.all([
      AdminService.getUsers(),
      AdminService.getListings(),
    ]);
    users.value = usersResponse.data.users;
    listings.value = listingsResponse.data.listings;
    createConversationModal.value.show();
  } catch (error) {
    console.error('Error fetching users or listings:', error);
  }
};

const createConversation = async () => {
  try {
    await AdminService.createConversation(conversationForm);
    fetchConversations();
    createConversationModal.value.hide();
  } catch (error) {
    console.error('Error creating conversation:', error);
  }
};

onMounted(() => {
  fetchConversations();
});
</script>
<template>
  <h1 class="h3 mb-3">Message Management</h1>
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title">Conversations</h5>
          <div class="card-tools">
            <BButton variant="primary" size="sm" @click="openConversationModal()">Create Message</BButton>
          </div>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table table-hover text-nowrap">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Participants</th>
                <th>Last Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="convo in conversations" :key="convo.id">
                <td>{{ convo.listing ? convo.listing.title : 'N/A' }}</td>
                <td>{{ convo.userOne.displayName }} &harr; {{ convo.userTwo.displayName }}</td>
                <td>{{ new Date(convo.lastMessageAt).toLocaleString() }}</td>
                <td>
                  <BButton variant="info" size="sm" @click="viewConversation(convo)">View</BButton>
                  <BButton variant="danger" size="sm" @click="deleteConversation(convo.id)">Delete</BButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Conversation Modal -->
  <BModal ref="conversationModal" title="Conversation Details" size="lg" hide-footer>
    <div v-if="selectedConversation">
      <ul class="list-unstyled">
        <li v-for="message in selectedConversation.messages" :key="message.id" class="media mb-2">
          <div class="media-body">
            <div class="d-flex justify-content-between">
              <strong>{{ message.sender.displayName }}</strong>
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

  <!-- Create Conversation Modal -->
  <BModal ref="createConversationModal" title="Create New Conversation" size="lg" @ok="createConversation">
    <form>
      <div class="form-group">
        <label for="userOne">User One</label>
        <select class="form-control" id="userOne" v-model="conversationForm.userOneId" required>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.displayName || user.email }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="userTwo">User Two</label>
        <select class="form-control" id="userTwo" v-model="conversationForm.userTwoId" required>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.displayName || user.email  }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="listing">Listing (Optional)</label>
        <select class="form-control" id="listing" v-model="conversationForm.listingId">
          <option value="">None</option>
          <option v-for="listing in listings" :key="listing.id" :value="listing.id">{{ listing.title }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="messageContent">Message</label>
        <textarea class="form-control" id="messageContent" rows="5" v-model="conversationForm.content" required></textarea>
      </div>
    </form>
  </BModal>
</template>
<style scoped>
</style>