<script setup>
import FooterComponent from "src/components/FooterComponent.vue";
import NavBar from "src/components/NavBar.vue";
import { ref } from "vue";

const editName = ref(true);
const editPassword = ref(true);
const editEmail = ref(true);
const deletetion = ref(false);

const username = ref("testing");
const email = ref("email");
const first_name = ref("first name");
const last_name = ref("last name");

const current_password = ref("");
const confirm_password = ref("");
const new_password = ref("");

const handleClick = () => {
  if (!editPassword.value) {
    editPassword.value = true;
    console.log("password");
  }
  if (!editName.value) {
    editName.value = true;
    console.log("name");
  }
};

const deleteAccount = () => {
  console.log("deleted");
  deletetion.value = false;
};
</script>

<template>
  <NavBar />
  <div class="main">
    <div class="q-mx-auto q-my-xl" style="width: 70%">
      <div class="ys text-h4">Your Account</div>
      <q-separator class="q-mt-lg q-mb-xl" />

      <div class="q-mb-md oswald" style="width: 100%; max-width: 45%">
        <div class="ys text-h6 q-mb-sm">Username</div>
        <q-input
          class="q-mb-sm"
          label="First Name"
          v-model="username"
          standout="bg-grey-3 text-deep-purple-14"
          input-class="text-dark"
          disable
        />
        <div class="row justify-end text-grey-6 text-body2">
          Username cannot be edited
        </div>
      </div>

      <q-separator class="q-mb-xl" />
      <div class="row justify-between">
        <div class="oswald" style="width: 100%; max-width: 45%">
          <div class="row ys q-mb-md">
            <div class="text-h6 on-left">Name</div>
            <div
              class="oswald underline row items-center text-deep-purple-14 text-body2"
            >
              <div
                class="cursor-pointer"
                v-if="editName"
                @click="editName = false"
              >
                Edit Name
              </div>
            </div>
          </div>
          <q-input
            class="q-mb-lg"
            label="First Name"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            v-model="first_name"
            :disable="editName"
          />
          <q-input
            label="Last Name"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            v-model="last_name"
            :disable="editName"
          />
        </div>

        <q-separator vertical />
        <div class="oswald" style="width: 100%; max-width: 45%">
          <div class="row ys q-mb-md">
            <div class="text-h6 on-left">Password</div>
            <div
              class="oswald underline row items-center text-deep-purple-14 text-body2"
            >
              <div
                class="cursor-pointer"
                v-if="editPassword"
                @click="editPassword = false"
              >
                Change Password
              </div>
            </div>
          </div>
          <q-input
            class="q-mb-lg"
            label="Current Password"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            v-model="current_password"
            :disable="editPassword"
          />
          <q-input
            label="New Password"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            v-model="new_password"
            :disable="editPassword"
          />
        </div>
      </div>

      <div class="q-mb-xl row justify-center">
        <q-btn
          v-if="!editPassword || !editName"
          class="q-mt-lg on-left"
          label="Confirm Changes"
          color="dark"
          flat
          @click="(editPassword = true), (editName = true)"
        />
        <q-btn
          v-if="!editPassword || !editName"
          class="q-mt-lg on-right"
          label="Confirm Changes"
          color="deep-purple-14"
          push
          @click="handleClick"
        />
      </div>

      <div class="q-mb-md oswald">
        <div class="q-mb-sm row items-center">
          <div class="ys text-h6 on-left">Email</div>
          <div
            class="cursor-pointer oswald text-deep-purple-14"
            v-if="editEmail"
            @click="editEmail = false"
          >
            Change Email
          </div>
        </div>
        <div class="row items-center">
          <q-input
            style="width: 100%; max-width: 45%"
            label="Email"
            v-model="email"
            standout="bg-grey-3 text-deep-purple-14"
            input-class="text-dark"
            :disable="editEmail"
          />
          <q-btn
            v-if="!editEmail"
            class="on-right"
            label="Cancel"
            color="dark"
            @click="editEmail = true"
            flat
          />
          <q-btn
            v-if="!editEmail"
            class="on-right"
            label="Apply Changes"
            color="deep-purple-14"
            @click="editEmail = true"
            push
          />
        </div>
      </div>

      <div class="row justify-end">
        <q-btn
          flat
          label="Delete Account"
          color="negative"
          @click="deletetion = true"
        />
      </div>
    </div>
    <q-dialog v-model="deletetion">
      <q-card style="width: 100%; max-width: 700px">
        <q-card-section class="text-h6 ys bg-deep-purple-14 text-white">
          Are you sure you want to permanently delete your account?
        </q-card-section>
        <q-card-section class="oswald text-body1">
          <div>By deleting your account:</div>
          <div class="q-ml-md">
            <div>
              <q-icon name="remove" />
              You will lose access to your order history and any saved cart
              items.
            </div>
            <div>
              <q-icon name="remove" />
              Any active subscriptions or membership benefits will be canceled.
            </div>
            <div>
              <q-icon name="remove" />
              You will lose access to your order history and any saved cart
              items.
            </div>
            <div>
              <q-icon name="remove" />
              You won't be able to track the status of current or future orders.
            </div>
            <div>
              <q-icon name="remove" />
              Your personal information will be permanently removed from our
              system and will not be used for future transactions.
            </div>
          </div>
        </q-card-section>
        <q-card-section class="oswald text-body1 q-mx-xl">
          Please confirm your decision by entering your account password:
          <q-input
            class="q-my-md"
            label="Password"
            v-model="password"
            input-class="text-black"
            standout="text-deep-purple-14 bg-grey-3"
          />
          <q-input
            label="Confirm Password"
            input-class="text-black"
            v-model="confirm_password"
            standout="text-deep-purple-14 bg-grey-3"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            label="cancel"
            push
            color="dark"
            style="width: 100%; max-width: 150px"
            v-close-popup
          />
          <q-btn
            label="delete"
            style="width: 100%; max-width: 150px"
            flat
            color="negative"
            @click="deleteAccount"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  <FooterComponent />
</template>
