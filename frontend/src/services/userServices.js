import api from './api';

class UserService {
	getAll({ name = '' }) {
		return api.get(`/users?name=${name}`);
	}
	delete(id) {
		return api.delete(`/users/${id}`);
	}
	create(payload) {
		console.log(payload);
		return api.post(`/users`, payload);
	}
	update({ id, payload }) {
		return api.put(`/users/${id}`, payload);
	}
}

const userService = new UserService();

export default userService;
