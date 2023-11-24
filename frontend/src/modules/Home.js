'use client';
import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import userServices from '@/services/userServices';
import * as yup from 'yup';

const Home = () => {
	const [name, setName] = React.useState('');

	const { data, refetch, isLoading } = useQuery({
		queryFn: () => userServices.getAll({ name }),
		queryKey: ['users'],
		select: ({ data }) => data,
	});

	const createUser = useMutation({
		mutationFn: ({ name, age, email }) =>
			userServices.create({ name, age, email }),
		mutationKey: ['createUser'],
	});

	const delUser = useMutation({
		mutationFn: (id) => userServices.delete(id),
		mutationKey: ['delUser'],
	});

	const updateUser = useMutation({
		mutationFn: ({ id, payload }) => userServices.update({ id, payload }),
		mutationKey: ['updateUser'],
	});

	const formik = useFormik({
		initialValues: {
			name: '',
			age: '',
			email: '',
		},
		validationSchema: yup.object().shape({
			name: yup.string().required('Nome obrigatório'),
			age: yup.number().required('Idade obrigatória'),
			email: yup
				.string()
				.matches(/^\S+@\S+\.\S+$/, 'Formato invalido')
				.required('Email obrigatório'),
		}),
		onSubmit: async (values) => {
			try {
				if (formik.values.id) {
					await updateUser.mutateAsync({
						id: values.id,
						payload: values,
					});
				}
				if (!formik.values.id) {
					await createUser.mutateAsync(values);
				}
				formik.resetForm();
				refetch();
			} catch (error) {
				console.log(error);
			}
		},
	});

	return (
		<div>
			<h1>Consumo com Tanstack</h1>
			<h2>{formik.values.id ? 'Editar' : 'Adicionar'} pessoa</h2>
			<div style={{ marginBottom: '20px', display: 'inline-flex' }}>
				<div>
					<input
						style={{ border: formik.errors.name && '2px solid red' }}
						type="text"
						placeholder="Nome"
						value={formik.values.name}
						onChange={(e) => formik.setFieldValue('name', e.target.value)}
					/>
					{formik.errors.name && (
						<p style={{ color: 'red ' }}>{formik.errors.name}</p>
					)}
				</div>
				<div>
					<input
						style={{ border: formik.errors.age && '2px solid red' }}
						type="number"
						placeholder="Idade"
						value={formik.values.age}
						onChange={(e) => formik.setFieldValue('age', e.target.value)}
					/>
					{formik.errors.age && (
						<p style={{ color: 'red ' }}>{formik.errors.age}</p>
					)}
				</div>
				<div>
					<input
						style={{ border: formik.errors.email && '2px solid red' }}
						type="text"
						placeholder="email"
						value={formik.values.email}
						onChange={(e) => formik.setFieldValue('email', e.target.value)}
					/>
					{formik.errors.email && (
						<p style={{ color: 'red ' }}>{formik.errors.email}</p>
					)}
				</div>
			</div>
			<button onClick={() => formik.handleSubmit()}>
				{createUser.isPending
					? 'Carregando'
					: formik.values.id
					? 'Atualizar'
					: 'Enviar'}
			</button>
			<div>
				<input
					type="text"
					placeholder="Nome..."
					onChange={(e) => setName(e.target.value)}
				/>
				<button onClick={() => refetch()}>Filtrar</button>
			</div>
			{isLoading ? (
				<p>Carregando</p>
			) : (
				<>
					{data?.meta?.amount > 0 ? (
						data?.result?.map((el) => (
							<div
								style={{
									border: '1px solid red',
									width: '300px',
									display: 'inline-flex',
									flexDirection: 'column',
									alignItems: 'center',
									margin: '24px',
									padding: '16px',
								}}
								key={el.id}
							>
								<p>Nome: {el.name}</p>
								<p>Idade: {el.age}</p>
								<p>Email: {el.email}</p>
								<div
									style={{
										width: '80%',
										display: 'flex',
										justifyContent: 'space-around',
									}}
								>
									<button
										onClick={async () => {
											await delUser.mutateAsync(el.id);
											refetch();
										}}
									>
										Deletar
									</button>
									<button onClick={async () => formik.setValues(el)}>
										Update User
									</button>
								</div>
							</div>
						))
					) : (
						<h1>Não existem usuários na base</h1>
					)}
				</>
			)}
		</div>
	);
};

export default Home;
